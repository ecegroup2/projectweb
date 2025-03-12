// Configuration
const config = {
    apiUrl: 'https://api.example.com/ecg-data', // Replace with your actual API endpoint
    lineColor: '#00A651',
    lineWidth: 2,
    backgroundColor: '#000000',
    gridColor: '#004000',
    animationSpeed: 2, // Pixels per frame
    refreshRate: 20,   // Milliseconds between animation frames
    gridSize: 25       // Size of grid squares in pixels
};

// Variables for canvas and context
const canvas = document.getElementById('ecgCanvas');
const ctx = canvas.getContext('2d');
const loadingElement = document.getElementById('loading');

// Variables for data and animation state
let ecgData = [];
let displayData = [];
let animationFrame = null;
let currentPosition = 0;
let isLoading = true;
let isAnimating = false;

// Set canvas dimensions properly
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    draw();
}

// Initialize the canvas
function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Fetch data from the API
async function fetchECGData() {
    isLoading = true;
    loadingElement.style.display = 'block';
    
    try {
        const response = await fetch(config.apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        ecgData = data.ecgValues || [];
        
        isLoading = false;
        loadingElement.style.display = 'none';
        
        // Initialize display data
        displayData = [];
        currentPosition = 0;
        
        // Start animation if it's not already running
        if (!isAnimating) {
            startAnimation();
        }
    } catch (error) {
        console.error('Error fetching ECG data:', error);
        loadingElement.textContent = 'Failed to load ECG data. Using mock data.';
        
        // Generate mock data for testing
        generateMockECGData();
    }
}

// Generate mock ECG data for testing
function generateMockECGData() {
    // Create a sample ECG data array
    ecgData = getSampleECGData();
    
    isLoading = false;
    loadingElement.style.display = 'none';
    
    // Initialize display data
    displayData = [];
    currentPosition = 0;
    
    // Start animation
    startAnimation();
}

// Generate sample ECG data based on real ECG patterns
function getSampleECGData() {
    const sampleData = [];
    const baseline = 100;
    const beats = 50; // Number of heartbeats to generate
    
    for (let beat = 0; beat < beats; beat++) {
        // Generate a single ECG complex (PQRST)
        
        // Baseline before P wave
        for (let i = 0; i < 20; i++) {
            sampleData.push(baseline + (Math.random() * 2 - 1));
        }
        
        // P wave (small bump)
        for (let i = 0; i < 10; i++) {
            const amplitude = 15 * Math.sin(Math.PI * i / 10);
            sampleData.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // PR segment (return to baseline)
        for (let i = 0; i < 10; i++) {
            sampleData.push(baseline + (Math.random() * 2 - 1));
        }
        
        // QRS complex
        // Q wave (small dip)
        for (let i = 0; i < 3; i++) {
            sampleData.push(baseline - 10 - (i * 5) + (Math.random() * 2 - 1));
        }
        
        // R wave (large spike)
        for (let i = 0; i < 4; i++) {
            const amplitude = i < 2 ? 40 * i : 80 - (40 * (i - 2));
            sampleData.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // S wave (dip after R)
        for (let i = 0; i < 3; i++) {
            sampleData.push(baseline - 30 + (i * 10) + (Math.random() * 2 - 1));
        }
        
        // ST segment (return to baseline)
        for (let i = 0; i < 10; i++) {
            sampleData.push(baseline + (Math.random() * 2 - 1));
        }
        
        // T wave (medium bump)
        for (let i = 0; i < 15; i++) {
            const amplitude = 20 * Math.sin(Math.PI * i / 15);
            sampleData.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // Rest of cycle (return to baseline)
        for (let i = 0; i < 25; i++) {
            sampleData.push(baseline + (Math.random() * 2 - 1));
        }
    }
    
    return sampleData;
}

// Start the animation loop
function startAnimation() {
    isAnimating = true;
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    // Animation function
    const animate = () => {
        updateDisplayData();
        draw();
        animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
}

// Stop the animation
function stopAnimation() {
    isAnimating = false;
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
}

// Update the display data for the current frame
function updateDisplayData() {
    // Calculate how many data points fit on the screen
    const pointsOnScreen = Math.floor(canvas.width / config.animationSpeed);
    
    // If we don't have enough data yet, add the next point
    if (displayData.length < pointsOnScreen && currentPosition < ecgData.length) {
        displayData.push(ecgData[currentPosition]);
        currentPosition++;
        
        // If we've reached the end of the data, loop back to the beginning
        if (currentPosition >= ecgData.length) {
            currentPosition = 0;
        }
    } else {
        // Remove the oldest point and add the newest
        displayData.shift();
        displayData.push(ecgData[currentPosition]);
        currentPosition++;
        
        // If we've reached the end of the data, loop back to the beginning
        if (currentPosition >= ecgData.length) {
            currentPosition = 0;
        }
    }
}

// Draw the ECG curve
function draw() {
    if (isLoading || displayData.length === 0) return;
    
    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    drawGrid();
    
    // Find min and max values for scaling
    const minValue = Math.min(...displayData);
    const maxValue = Math.max(...displayData);
    const dataRange = maxValue - minValue;
    
    // Calculate vertical scaling factor with padding
    const padding = canvas.height * 0.1;
    const yScale = (canvas.height - padding * 2) / dataRange;
    
    // Draw ECG line
    ctx.beginPath();
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = config.lineWidth;
    ctx.lineJoin = 'round';
    
    for (let i = 0; i < displayData.length; i++) {
        const x = i * config.animationSpeed;
        const y = canvas.height - padding - (displayData[i] - minValue) * yScale;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

// Draw grid lines
function drawGrid() {
    ctx.strokeStyle = config.gridColor;
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = 0; x < canvas.width; x += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y < canvas.height; y += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Toggle animation
function toggleAnimation() {
    if (isAnimating) {
        stopAnimation();
        document.getElementById('toggleBtn').textContent = 'Start Animation';
    } else {
        startAnimation();
        document.getElementById('toggleBtn').textContent = 'Pause Animation';
    }
}

// Reset animation
function resetAnimation() {
    displayData = [];
    currentPosition = 0;
    if (!isAnimating) {
        startAnimation();
        document.getElementById('toggleBtn').textContent = 'Pause Animation';
    }
}

// Event listeners for buttons
document.getElementById('fetchBtn').addEventListener('click', fetchECGData);
document.getElementById('toggleBtn').addEventListener('click', toggleAnimation);
document.getElementById('resetBtn').addEventListener('click', resetAnimation);

// Initialize the application
initCanvas();
fetchECGData();