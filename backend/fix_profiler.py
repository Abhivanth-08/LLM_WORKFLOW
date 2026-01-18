import re

# Read the file
with open('d:/agentic ai/llm_workflow/attention_profiler.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix get_head_explanation to convert all numpy types to Python types
pattern = r"return \{'layer': layer, 'head': head,"
replacement = "return {'layer': int(layer), 'head': int(head),"

content = content.replace(pattern, replacement)

# Also fix cluster_id
content = content.replace("'cluster_id': cluster_id,", "'cluster_id': int(cluster_id),")

# Fix features dict to use float()
content = content.replace(
    "self.feature_names[i]: round(avg_features[i], 3)",
    "self.feature_names[i]: round(float(avg_features[i]), 3)"
)

# Write back
with open('d:/agentic ai/llm_workflow/attention_profiler.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed numpy type conversions in get_head_explanation")
