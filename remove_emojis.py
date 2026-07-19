import os
import re
import sys

# Emoji patterns
emoji_pattern = re.compile(
    "[" 
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F300-\U0001F5FF"  # Symbols & pictographs
    "\U0001F680-\U0001F6FF"  # Transport & map symbols
    "\U0001F700-\U0001F77F"  # Alchemical symbols
    "\U0001F780-\U0001F7FF"  # Geometric shapes
    "\U0001F800-\U0001F8FF"  # Supplemental arrows
    "\U0001F900-\U0001F9FF"  # Supplemental symbols
    "\U0001FA00-\U0001FA6F"  # Chess symbols
    "\U0001FA70-\U0001FAFF"  # Symbols and pictographs extended A
    "\U00002702-\U000027B0"  # Dingbats
    "\U000024C2-\U0001F251"  # Enclosed characters
    "\U0001F1E0-\U0001F1FF"  # Flags (iOS)
    "\U0001F3F4-\U0001F3F7"  # Flags
    "\U0001F4F1-\U0001F4F8"  # Mobile phones
    "\U0001F4F9-\U0001F4FC"  # Video cameras
    "\U0001F4FD-\U0001F4FF"  # Camera
    "\U0001F508-\U0001F50B"  # Speaker
    "\U0001F50C-\U0001F50F"  # Light bulb
    "\U0001F510-\U0001F513"  # Lock
    "\U0001F514-\U0001F517"  # Bell
    "\U0001F518-\U0001F51A"  # Bookmark
    "\U0001F51B-\U0001F521"  # Chinese characters
    "\U0001F522-\U0001F524"  # Input symbols
    "\U0001F525-\U0001F528"  # Fire
    "\U0001F529-\U0001F52B"  # Toolbox
    "\U0001F52C-\U0001F52F"  # Magnifying glass
    "\U0001F530-\U0001F532"  # Cross mark
    "\U0001F533-\U0001F535"  # Squares
    "\U0001F536-\U0001F538"  # Triangles
    "\U0001F539-\U0001F53B"  # Diamond
    "\U0001F53C-\U0001F53D"  # Up/down
    "\U0001F53E-\U0001F540"  # Arrow
    "\U0001F541-\U0001F543"  # Pointer
    "\U0001F544-\U0001F546"  # Arrow
    "\U0001F547-\U0001F548"  # Pencil
    "\U0001F549-\U0001F54A"  # Dove
    "\U0001F54B-\U0001F54E"  # Maps
    "]+",
    flags=re.UNICODE
)

def remove_emojis(text):
    """Remove emojis from text"""
    return emoji_pattern.sub('', text)

def process_file(filepath):
    """Process a single file and remove emojis"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove emojis
        new_content = remove_emojis(content)
        
        # Only write if changes were made
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Processed: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False

def main():
    # File extensions to process
    extensions = {'.py', '.jsx', '.js', '.css', '.html', '.txt', '.md', '.json', '.env'}
    
    # Directories to process
    target_dirs = ['backend', 'frontend']
    
    # Process each directory
    total_processed = 0
    for target_dir in target_dirs:
        if not os.path.exists(target_dir):
            print(f"⚠️ Directory not found: {target_dir}")
            continue
        
        for root, dirs, files in os.walk(target_dir):
            # Skip node_modules, venv, .git, __pycache__
            if 'node_modules' in root or 'venv' in root or '.git' in root or '__pycache__' in root:
                continue
            
            for file in files:
                # Check file extension
                ext = os.path.splitext(file)[1].lower()
                if ext in extensions:
                    filepath = os.path.join(root, file)
                    if process_file(filepath):
                        total_processed += 1
    
    print(f"\n✅ Total files processed: {total_processed}")

if __name__ == '__main__':
    main()
