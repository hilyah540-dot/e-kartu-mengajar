import re

with open('src/components/MenuView.tsx', 'r') as f:
    content = f.read()

content = content.replace(" Star,", " Sparkles,")
content = content.replace("<Star ", "<Sparkles ")

with open('src/components/MenuView.tsx', 'w') as f:
    f.write(content)
