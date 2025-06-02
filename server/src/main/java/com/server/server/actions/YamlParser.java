package com.server.server.actions;

import com.server.server.models.PipelineStep;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.util.*;

public class YamlParser {
    public static List<PipelineStep> loadPipeline(File yamlFile) throws IOException {
        Yaml yaml = new Yaml();
        try (InputStream in = new FileInputStream(yamlFile)) {
            Map<String, Object> data = yaml.load(in);
            List<Map<String, String>> steps = (List<Map<String, String>>) data.get("steps");
            List<PipelineStep> parsed = new ArrayList<>();
            for (Map<String, String> step : steps) {
                PipelineStep s = new PipelineStep();
                s.setName(step.get("name"));
                s.setCommand(step.get("command"));
                parsed.add(s);
            }
            return parsed;
        }
    }
}

