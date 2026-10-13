package com.example.demo.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class PolicyRagService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyRagService.class);

    private final VectorStore vectorStore;
    private final ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
    private boolean isIndexed = false;

    public PolicyRagService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @PostConstruct
    public void init() {
        try {
            ingestPolicyDocuments();
        } catch (Exception e) {
            logger.error("Failed to initialize Policy RAG knowledge base on startup: {}", e.getMessage(), e);
        }
    }

    public synchronized int ingestPolicyDocuments() {
        logger.info("Starting Policy Document ETL Pipeline: Ingesting policies into Vector Store...");
        List<Document> documentsToIndex = new ArrayList<>();

        try {
            Resource[] resources = resourceResolver.getResources("classpath:docs/policies/*.md");
            logger.info("Found {} policy document(s) in classpath:docs/policies/", resources.length);

            for (Resource resource : resources) {
                String filename = resource.getFilename();
                String content;
                try (InputStream is = resource.getInputStream()) {
                    content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                }

                List<Document> chunks = chunkPolicyDocument(filename, content);
                documentsToIndex.addAll(chunks);
                logger.info("Parsed '{}' into {} semantic chunks", filename, chunks.size());
            }

            if (!documentsToIndex.isEmpty()) {
                vectorStore.add(documentsToIndex);
                this.isIndexed = true;
                logger.info("Successfully vectorized and indexed {} total chunks into VectorStore", documentsToIndex.size());
            }

        } catch (Exception e) {
            logger.error("Error during policy document ingestion: {}", e.getMessage(), e);
        }

        return documentsToIndex.size();
    }

    private List<Document> chunkPolicyDocument(String filename, String content) {
        List<Document> chunks = new ArrayList<>();
        String[] lines = content.split("\r?\n");

        String documentTitle = filename;
        String currentSection = "General Overview";
        StringBuilder sectionBuffer = new StringBuilder();

        for (String line : lines) {
            if (line.startsWith("# ")) {
                documentTitle = line.substring(2).trim();
            } else if (line.startsWith("## ")) {
                if (sectionBuffer.length() > 0) {
                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("source", filename);
                    metadata.put("title", documentTitle);
                    metadata.put("section", currentSection);

                    chunks.add(new Document(
                            "Policy: " + documentTitle + "\nSection: " + currentSection + "\n" + sectionBuffer.toString().trim(),
                            metadata
                    ));
                    sectionBuffer.setLength(0);
                }
                currentSection = line.substring(3).trim();
            } else {
                sectionBuffer.append(line).append("\n");
            }
        }

        if (sectionBuffer.length() > 0) {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("source", filename);
            metadata.put("title", documentTitle);
            metadata.put("section", currentSection);

            chunks.add(new Document(
                    "Policy: " + documentTitle + "\nSection: " + currentSection + "\n" + sectionBuffer.toString().trim(),
                    metadata
            ));
        }

        return chunks;
    }

    public RagResult retrieveRelevantClauses(String userQuery, int topK) {
        if (!isIndexed || userQuery == null || userQuery.isBlank()) {
            return RagResult.empty();
        }

        try {
            SearchRequest request = SearchRequest.builder()
                    .query(userQuery)
                    .topK(topK)
                    .similarityThreshold(0.30)
                    .build();

            List<Document> matchedDocs = vectorStore.similaritySearch(request);
            if (matchedDocs == null || matchedDocs.isEmpty()) {
                return RagResult.empty();
            }

            StringBuilder contextBuilder = new StringBuilder();
            List<String> citations = new ArrayList<>();
            Set<String> uniqueCitations = new LinkedHashSet<>();

            for (Document doc : matchedDocs) {
                contextBuilder.append("---\n").append(doc.getText()).append("\n");

                Object title = doc.getMetadata().get("title");
                Object section = doc.getMetadata().get("section");
                if (title != null && section != null) {
                    uniqueCitations.add(title + " — " + section);
                } else if (title != null) {
                    uniqueCitations.add(title.toString());
                }
            }

            citations.addAll(uniqueCitations);
            return new RagResult(contextBuilder.toString(), citations);

        } catch (Exception e) {
            logger.warn("Vector similarity search failed for query '{}': {}", userQuery, e.getMessage());
            return RagResult.empty();
        }
    }

    public static class RagResult {
        private final String contextText;
        private final List<String> citations;

        public RagResult(String contextText, List<String> citations) {
            this.contextText = contextText;
            this.citations = citations != null ? citations : Collections.emptyList();
        }

        public static RagResult empty() {
            return new RagResult("", Collections.emptyList());
        }

        public boolean hasContext() {
            return contextText != null && !contextText.isBlank();
        }

        public String getContextText() {
            return contextText;
        }

        public List<String> getCitations() {
            return citations;
        }
    }
}
