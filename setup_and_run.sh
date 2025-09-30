#!/bin/bash
echo "======================================="
echo "   Stock Scanner Setup and Launcher"
echo "======================================="

# Step 1 - Create virtual environment if it doesn’t exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Step 2 - Activate virtual environment
source .venv/bin/activate

# Step 3 - Upgrade pip
pip install --upgrade pip

# Step 4 - Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Step 5 - Run the Streamlit app
echo "Starting Streamlit app..."
streamlit run main.py
