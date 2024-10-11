# Let's extract the data from the provided curriculum outcomes and convert them to the given structure.
import json
import re

with open('input_file.txt', 'r', encoding='utf-8') as f:
    input_data = f.read()

parsed_data = []
current_entry = None

regex_pattern = re.compile(r"(\w+-\d+-\w+)\t(.*?)?\s*GLO: ([A-Z0-9,\s]+)\n")

parsed_data = []
for match in regex_pattern.finditer(input_data):
    code, slo, glo = match.groups()
    glo_list = [g.strip() for g in glo.split(",")]

    # Extract grade, cluster, and id from the code
    code_parts = code.split("-")
    if len(code_parts) == 3:
        grade = code_parts[0]
        cluster = code_parts[1]
        id_ = code_parts[2]

        # Append to parsed data
        parsed_data.append({
            "specific_learning_outcome": slo,
            "general_learning_outcomes": glo_list,
            "grade": grade,
            "cluster": cluster,
            "id": id_
        })

with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_data, f, indent=4, ensure_ascii=False)