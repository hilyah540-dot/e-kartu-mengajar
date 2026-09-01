import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace all onBack={() => navigateTo(...)} with onBack={() => window.history.back()}
content = re.sub(r"onBack=\{\(\) => navigateTo\('[^']+'\)\}", "onBack={() => window.history.back()}", content)
content = re.sub(r"onBackMenu=\{\(\) => navigateTo\('menu'\)\}", "onBackMenu={() => window.history.back()}", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

