// This file contains sample ECG data that can be used for testing
// You can include this file in your project for offline testing

// Function to generate realistic ECG data
function generateECGData(numBeats = 10) {
    const data = [];
    const baseline = 100;
    
    for (let beat = 0; beat < numBeats; beat++) {
        // Generate a single heartbeat pattern
        
        // Baseline (isoelectric line)
        for (let i = 0; i < 20; i++) {
            data.push(baseline + (Math.random() * 2 - 1));
        }
        
        // P wave (atrial depolarization)
        for (let i = 0; i < 10; i++) {
            const amplitude = 15 * Math.sin(Math.PI * i / 10);
            data.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // PR segment
        for (let i = 0; i < 10; i++) {
            data.push(baseline + (Math.random() * 2 - 1));
        }
        
        // QRS complex (ventricular depolarization)
        // Q wave
        for (let i = 0; i < 3; i++) {
            data.push(baseline - 10 - (i * 5) + (Math.random() * 2 - 1));
        }
        
        // R wave (main spike)
        for (let i = 0; i < 4; i++) {
            const amplitude = i < 2 ? 40 * i : 80 - (40 * (i - 2));
            data.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // S wave
        for (let i = 0; i < 3; i++) {
            data.push(baseline - 30 + (i * 10) + (Math.random() * 2 - 1));
        }
        
        // ST segment
        for (let i = 0; i < 10; i++) {
            data.push(baseline + (Math.random() * 2 - 1));
        }
        
        // T wave (ventricular repolarization)
        for (let i = 0; i < 15; i++) {
            const amplitude = 20 * Math.sin(Math.PI * i / 15);
            data.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
        
        // TP segment (rest until next beat)
        for (let i = 0; i < 25; i++) {
            data.push(baseline + (Math.random() * 2 - 1));
        }
    }
    
    return data;
}

// Generate different heart rate patterns
function generateVariableHeartRateData(numBeats = 20, heartRateVariation = "normal") {
    let data = [];
    const baseline = 100;
    
    // Different beat spacing based on heart rate pattern
    let spacingFactors = [];
    
    switch (heartRateVariation) {
        case "normal":
            // Normal sinus rhythm with slight variations
            spacingFactors = Array(numBeats).fill(1).map(() => 1 + (Math.random() * 0.1 - 0.05));
            break;
        case "tachycardia":
            // Fast heart rate (shorter spaces between beats)
            spacingFactors = Array(numBeats).fill(0.7).map(() => 0.7 + (Math.random() * 0.1 - 0.05));
            break;
        case "bradycardia":
            // Slow heart rate (longer spaces between beats)
            spacingFactors = Array(numBeats).fill(1.5).map(() => 1.5 + (Math.random() * 0.1 - 0.05));
            break;
        case "arrhythmia":
            // Irregular heart rhythm
            spacingFactors = Array(numBeats).fill(1).map(() => 0.7 + (Math.random() * 0.8));
            break;
        case "afib":
            // Atrial fibrillation simulation (irregular rhythm with no clear P waves)
            spacingFactors = Array(numBeats).fill(1).map(() => 0.8 + (Math.random() * 0.4));
            break;
        default:
            spacingFactors = Array(numBeats).fill(1);
    }
    
    for (let beat = 0; beat < numBeats; beat++) {
        // Generate a single heartbeat pattern
        const beatData = generateSingleBeat(baseline, heartRateVariation);
        data = data.concat(beatData);
        
        // Add variable spacing between beats
        const spacingFactor = spacingFactors[beat];
        const spacingPoints = Math.floor(25 * spacingFactor);
        
        // Add the spacing after the beat
        for (let i = 0; i < spacingPoints; i++) {
            data.push(baseline + (Math.random() * 2 - 1));
        }
    }
    
    return data;
}

// Generate a single heartbeat with different pattern options
function generateSingleBeat(baseline = 100, pattern = "normal") {
    const beatData = [];
    
    // Modify parameters based on the pattern
    let pWaveAmplitude = 15;
    let rWaveAmplitude = 80;
    let tWaveAmplitude = 20;
    let sWaveDepth = 30;
    let qWaveDepth = 10;
    let stElevation = 0;
    
    switch (pattern) {
        case "normal":
            // Normal ECG parameters - no changes needed
            break;
        case "stElevation":
            // ST elevation (myocardial infarction)
            stElevation = 15;
            break;
        case "stDepression":
            // ST depression (ischemia)
            stElevation = -10;
            break;
        case "tachycardia":
            // Fast heart rate - normal morphology
            break;
        case "bradycardia":
            // Slow heart rate - normal morphology
            break;
        case "afib":
            // Atrial fibrillation - no clear P waves, irregular
            pWaveAmplitude = 0;
            break;
        case "pvcs":
            // Premature ventricular contraction - wide QRS, no P wave
            pWaveAmplitude = 0;
            rWaveAmplitude = 100;
            qWaveDepth = 20;
            tWaveAmplitude = -30; // Inverted T wave
            break;
        case "lvh":
            // Left ventricular hypertrophy - tall R waves
            rWaveAmplitude = 120;
            break;
    }
    
    // Baseline before P wave
    for (let i = 0; i < 20; i++) {
        beatData.push(baseline + (Math.random() * 2 - 1));
    }
    
    // P wave (unless afib or PVCs)
    if (pWaveAmplitude > 0) {
        for (let i = 0; i < 10; i++) {
            const amplitude = pWaveAmplitude * Math.sin(Math.PI * i / 10);
            beatData.push(baseline + amplitude + (Math.random() * 2 - 1));
        }
    }
    
    // PR segment
    for (let i = 0; i < 10; i++) {
        beatData.push(baseline + (Math.random() * 2 - 1));
    }
    
    // QRS complex
    // Q wave
    for (let i = 0; i < 3; i++) {
        beatData.push(baseline - qWaveDepth - (i * 5) + (Math.random() * 2 - 1));
    }
    
    // R wave
    for (let i = 0; i < 4; i++) {
        const amplitude = i < 2 ? (rWaveAmplitude/2) * i : rWaveAmplitude - ((rWaveAmplitude/2) * (i - 2));
        beatData.push(baseline + amplitude + (Math.random() * 2 - 1));
    }
    
    // S wave
    for (let i = 0; i < 3; i++) {
        beatData.push(baseline - sWaveDepth + (i * 10) + (Math.random() * 2 - 1));
    }
    
    // ST segment (with possible elevation/depression)
    for (let i = 0; i < 10; i++) {
        beatData.push(baseline + stElevation + (Math.random() * 2 - 1));
    }
    
    // T wave (can be inverted in some conditions)
    for (let i = 0; i < 15; i++) {
        const amplitude = tWaveAmplitude * Math.sin(Math.PI * i / 15);
        beatData.push(baseline + amplitude + (Math.random() * 2 - 1));
    }
    
    return beatData;
}

// Sample ECG datasets
const sampleECG = {
    // Normal sinus rhythm
    normal: generateVariableHeartRateData(20, "normal"),
    
    // Tachycardia (fast heart rate)
    tachycardia: generateVariableHeartRateData(30, "tachycardia"),
    
    // Bradycardia (slow heart rate)
    bradycardia: generateVariableHeartRateData(15, "bradycardia"),
    
    // Arrhythmia (irregular rhythm)
    arrhythmia: generateVariableHeartRateData(20, "arrhythmia"),
    
    // ST Elevation (potential myocardial infarction)
    stElevation: (() => {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push(...generateSingleBeat(100, "stElevation"));
            // Add spacing between beats
            for (let j = 0; j < 25; j++) {
                data.push(100 + (Math.random() * 2 - 1));
            }
        }
        return data;
    })(),
    
    // Atrial Fibrillation
    atrialFibrillation: generateVariableHeartRateData(25, "afib"),
    
    // Left Ventricular Hypertrophy
    lvh: (() => {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push(...generateSingleBeat(100, "lvh"));
            // Add spacing between beats
            for (let j = 0; j < 25; j++) {
                data.push(100 + (Math.random() * 2 - 1));
            }
        }
        return data;
    })()
};

// Export the data if using as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateECGData,
        generateVariableHeartRateData,
        generateSingleBeat,
        sampleECG
    };
}