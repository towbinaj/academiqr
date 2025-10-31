document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverElement = document.getElementById('game-over');
    const colorOptions = document.querySelectorAll('.color-option');

    // Game settings
    const gridSize = 20;
    const gameSpeed = 150; // milliseconds - slowed down from 100 to 150
    let canvasWidth = 600;
    let canvasHeight = 400;
    let gameInterval;
    let gameActive = false;
    let paused = false;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let snakeColor = '#4CAF50'; // Default green
    
    // Animation frames counter
    let animationFrame = 0;
    
    // Bomb timer
    let bombTimer = 0;
    const bombFlickerInterval = 50; // Frames before bombs change
    const bombLifetime = 150; // Frames before bombs disappear/reappear

    // Game objects
    let snake = [];
    let food = {};
    let bombs = [];
    const maxBombs = 3;
    let direction = 'right';
    let nextDirection = 'right';
    
    // Growth queue for the snake
    let growthQueue = 0;
    
    // Snake animation settings
    const snakeSegmentSpacing = 0.85; // Closer segments (was 1.0 implicitly)
    const snakeWiggleAmount = 0.12; // Increased wiggle (was 0.05)
    const snakeWiggleSpeed = 0.4; // Increased speed (was 0.3)

    // Food types (insects)
    const foodTypes = [
        { type: 'ant', emoji: '🐜', points: 1, probability: 0.6, growth: 1 },
        { type: 'bee', emoji: '🐝', points: 3, probability: 0.3, growth: 2 },
        { type: 'cricket', emoji: '🦗', points: 5, probability: 0.1, growth: 3 }
    ];
    
    // Preload images
    const snakeHeadImg = new Image();
    const snakeBodyImg = new Image();
    const snakeTailImg = new Image();
    const mushroomCloudImg = new Image();
    
    // Base SVG data for snake parts (without color)
    const baseSVGs = {
        head: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="COLOR_PLACEHOLDER" d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128z"/><path fill="#FFF" d="M192 224c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z"/><path fill="#333" d="M192 256c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm128 0c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/><path fill="#FF0000" d="M256 320c-17.7 0-32-14.3-32-32h64c0 17.7-14.3 32-32 32z"/></svg>',
        body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="COLOR_PLACEHOLDER" d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128z"/><path fill="DARKER_COLOR" d="M256 160c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96z"/></svg>',
        tail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="COLOR_PLACEHOLDER" d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128z"/><path fill="DARKER_COLOR" d="M256 160c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96z"/><path fill="#333" d="M224 192c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-64z"/></svg>'
    };
    
    // Update SVG with color and convert to data URL
    function createColoredSVG(svgString, color) {
        const darkerColor = darkenColor(color);
        return 'data:image/svg+xml;base64,' + btoa(
            svgString
                .replace(/COLOR_PLACEHOLDER/g, color)
                .replace(/DARKER_COLOR/g, darkerColor)
        );
    }
    
    // Initialize SVG images with default color
    updateSnakeImages('#4CAF50');
    
    mushroomCloudImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMjU2IDY0Yy0xNy43IDAtMzIgMTQuMy0zMiAzMnYzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMnMzMi0xNC4zIDMyLTMyVjk2YzAtMTcuNy0xNC4zLTMyLTMyLTMyeiIvPjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik0xNjAgMTYwYy01My4wIDAtOTYgNDMuMC05NiA5NiAwIDUwLjIgMzguNSA5MS40IDg3LjYgOTUuNkwxNjAgNDQ4aDE5MmwtOC40LTk2LjRjNDkuMS00LjIgODcuNi00NS40IDg3LjYtOTUuNiAwLTUzLTQzLTk2LTk2LTk2aC0xNzZ6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTE2MCAxOTJjLTM1LjMgMC02NCAyOC43LTY0IDY0czI4LjcgNjQgNjQgNjQgNjQtMjguNyA2NC02NC0yOC43LTY0LTY0LTY0em0xOTIgMGMtMzUuMyAwLTY0IDI4LjctNjQgNjRzMjguNyA2NCA2NCA2NCA2NC0yOC43IDY0LTY0LTI4LjctNjQtNjQtNjR6Ii8+PHBhdGggZmlsbD0iI0ZGOTgwMCIgZD0iTTI1NiAzODRjLTI2LjUgMC00OCAyMS41LTQ4IDQ4czIxLjUgNDggNDggNDggNDgtMjEuNSA0OC00OC0yMS41LTQ4LTQ4LTQ4eiIvPjwvc3ZnPg==';

    // Initialize the game
    function init() {
        // Set canvas size
        adjustCanvasSize();
        
        // Reset game state
        snake = [
            { x: 5 * gridSize, y: 10 * gridSize },
            { x: 4 * gridSize, y: 10 * gridSize },
            { x: 3 * gridSize, y: 10 * gridSize }
        ];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        bombs = [];
        animationFrame = 0;
        bombTimer = 0;
        growthQueue = 0;
        
        // Update score display
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        
        // Generate initial food and bombs
        generateFood();
        generateBombs();
        
        // Hide game over screen
        gameOverElement.classList.add('hidden');
    }

    // Adjust canvas size based on window size
    function adjustCanvasSize() {
        const containerWidth = document.querySelector('.game-container').offsetWidth - 40;
        canvasWidth = Math.min(600, containerWidth);
        canvasHeight = Math.min(400, Math.floor(canvasWidth * 0.67));
        
        // Ensure width and height are multiples of gridSize
        canvasWidth = Math.floor(canvasWidth / gridSize) * gridSize;
        canvasHeight = Math.floor(canvasHeight / gridSize) * gridSize;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    // Generate random food (insect)
    function generateFood() {
        // Determine food type based on probability
        const rand = Math.random();
        let cumulativeProbability = 0;
        let selectedFoodType;
        
        for (const foodType of foodTypes) {
            cumulativeProbability += foodType.probability;
            if (rand <= cumulativeProbability) {
                selectedFoodType = foodType;
                break;
            }
        }
        
        // Generate food at random position
        let validPosition = false;
        let newFood;
        
        while (!validPosition) {
            newFood = {
                x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
                type: selectedFoodType.type,
                emoji: selectedFoodType.emoji,
                points: selectedFoodType.points,
                growth: selectedFoodType.growth
            };
            
            // Check if position overlaps with snake or bombs
            validPosition = true;
            
            // Check snake overlap
            for (const segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    validPosition = false;
                    break;
                }
            }
            
            // Check bomb overlap
            if (validPosition) {
                for (const bomb of bombs) {
                    if (bomb.x === newFood.x && bomb.y === newFood.y) {
                        validPosition = false;
                        break;
                    }
                }
            }
        }
        
        food = newFood;
    }

    // Generate bombs
    function generateBombs() {
        const bombsToGenerate = Math.min(maxBombs, Math.floor(score / 10) + 1);
        
        // Clear existing bombs if we're regenerating all of them
        if (bombTimer >= bombLifetime) {
            bombs = [];
        }
        
        while (bombs.length < bombsToGenerate) {
            let validPosition = false;
            let newBomb;
            
            while (!validPosition) {
                newBomb = {
                    x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
                    y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
                    visible: true,
                    flickerState: true
                };
                
                // Check if position overlaps with snake, food, or other bombs
                validPosition = true;
                
                // Check snake overlap
                for (const segment of snake) {
                    if (segment.x === newBomb.x && segment.y === newBomb.y) {
                        validPosition = false;
                        break;
                    }
                }
                
                // Check food overlap
                if (validPosition && food.x === newBomb.x && food.y === newBomb.y) {
                    validPosition = false;
                }
                
                // Check other bombs overlap
                if (validPosition) {
                    for (const bomb of bombs) {
                        if (bomb.x === newBomb.x && bomb.y === newBomb.y) {
                            validPosition = false;
                            break;
                        }
                    }
                }
            }
            
            bombs.push(newBomb);
        }
    }

    // Update game state
    function update() {
        // Increment animation frame
        animationFrame = (animationFrame + 1) % 30;
        
        // Update bomb timer and handle bomb visibility
        bombTimer = (bombTimer + 1) % (bombLifetime * 2);
        
        // Handle bomb flickering and regeneration
        if (bombTimer % bombFlickerInterval === 0) {
            // Flicker bombs
            bombs.forEach(bomb => {
                bomb.flickerState = !bomb.flickerState;
            });
        }
        
        // Regenerate bombs periodically
        if (bombTimer === 0 || bombTimer === bombLifetime) {
            generateBombs();
        }
        
        // Move snake
        const head = { x: snake[0].x, y: snake[0].y };
        
        switch (direction) {
            case 'up':
                head.y -= gridSize;
                break;
            case 'down':
                head.y += gridSize;
                break;
            case 'left':
                head.x -= gridSize;
                break;
            case 'right':
                head.x += gridSize;
                break;
        }
        
        // Check for collisions
        if (
            head.x < 0 || 
            head.x >= canvasWidth || 
            head.y < 0 || 
            head.y >= canvasHeight || 
            checkSnakeCollision(head)
        ) {
            gameOver();
            return;
        }
        
        // Check for bomb collision
        for (let i = 0; i < bombs.length; i++) {
            if (bombs[i].visible && bombs[i].flickerState && head.x === bombs[i].x && head.y === bombs[i].y) {
                // Trigger explosion animation and game over
                explodeBomb(bombs[i]);
                return;
            }
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += food.points;
            scoreElement.textContent = score;
            
            // Add to growth queue based on food type
            growthQueue += food.growth;
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Generate new food and possibly new bombs
            generateFood();
            if (score % 5 === 0) {
                generateBombs();
            }
        } else if (growthQueue <= 0) {
            // Remove tail if no food was eaten and no growth is queued
            snake.pop();
        } else {
            // Decrement growth queue if we're growing
            growthQueue--;
        }
        
        // Update direction for next frame
        direction = nextDirection;
    }

    // Check if head collides with snake body
    function checkSnakeCollision(head) {
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // Render game
    function render() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Calculate snake segment positions with smoother transitions
        const smoothSnake = calculateSmoothSnake();
        
        // Draw snake in anime style
        for (let i = 0; i < smoothSnake.length; i++) {
            // Determine which part of the snake to draw
            let img;
            let rotation = 0;
            const segment = smoothSnake[i];
            
            if (i === 0) {
                // Head
                img = snakeHeadImg;
                
                // Set rotation based on direction
                switch (direction) {
                    case 'up':
                        rotation = -Math.PI/2;
                        break;
                    case 'down':
                        rotation = Math.PI/2;
                        break;
                    case 'left':
                        rotation = Math.PI;
                        break;
                    case 'right':
                        rotation = 0;
                        break;
                }
                
                // Add slight bobbing animation to head
                const headBob = Math.sin(animationFrame * 0.2) * 2;
                
                // Draw head with rotation and bobbing
                ctx.save();
                ctx.translate(segment.x + gridSize/2, segment.y + gridSize/2);
                ctx.rotate(rotation);
                // Add slight tilt for more animation
                ctx.rotate(Math.sin(animationFrame * 0.1) * 0.05);
                ctx.drawImage(img, -gridSize/2, -headBob/2 - gridSize/2, gridSize, gridSize);
                ctx.restore();
                
            } else if (i === smoothSnake.length - 1) {
                // Tail
                img = snakeTailImg;
                
                // Determine tail direction based on the previous segment
                const prevSegment = smoothSnake[i-1];
                
                if (prevSegment.x < segment.x) rotation = Math.PI; // tail points left
                else if (prevSegment.x > segment.x) rotation = 0; // tail points right
                else if (prevSegment.y < segment.y) rotation = Math.PI/2; // tail points up
                else rotation = -Math.PI/2; // tail points down
                
                // Add wagging animation to tail
                const tailWag = Math.sin(animationFrame * 0.3) * 0.2;
                
                // Draw tail with rotation and wagging
                ctx.save();
                ctx.translate(segment.x + gridSize/2, segment.y + gridSize/2);
                ctx.rotate(rotation);
                ctx.rotate(tailWag);
                ctx.drawImage(img, -gridSize/2, -gridSize/2, gridSize, gridSize);
                ctx.restore();
                
            } else {
                // Body
                img = snakeBodyImg;
                
                // Calculate direction to previous and next segments
                const prevSegment = smoothSnake[i-1];
                const nextSegment = smoothSnake[i+1];
                
                // Calculate angle between segments for smooth curves
                const dx1 = prevSegment.x - segment.x;
                const dy1 = prevSegment.y - segment.y;
                const dx2 = nextSegment.x - segment.x;
                const dy2 = nextSegment.y - segment.y;
                
                // Calculate angle for this segment
                const angle = Math.atan2(dy1 + dy2, dx1 + dx2) + Math.PI;
                
                // Add wiggle effect based on position in snake
                const wiggle = Math.sin((animationFrame * snakeWiggleSpeed + i * 0.5)) * snakeWiggleAmount;
                
                // Draw body segment with calculated angle and wiggle
                ctx.save();
                ctx.translate(segment.x + gridSize/2, segment.y + gridSize/2);
                ctx.rotate(angle);
                ctx.rotate(wiggle);
                
                // Scale slightly to create pulsing effect
                const pulse = 1 + Math.sin(animationFrame * 0.1 + i * 0.2) * 0.03;
                ctx.scale(pulse, pulse);
                
                ctx.drawImage(img, -gridSize/2, -gridSize/2, gridSize, gridSize);
                ctx.restore();
            }
        }
        
        // Draw food (insect)
        ctx.font = `${gridSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add floating animation to food
        const foodFloat = Math.sin(animationFrame * 0.1) * 3;
        ctx.fillText(food.emoji, food.x + gridSize / 2, food.y + gridSize / 2 + foodFloat);
        
        // Draw bombs with slight pulsing animation
        for (const bomb of bombs) {
            // Only draw visible bombs
            if (bomb.visible && bomb.flickerState) {
                const pulse = 1 + Math.sin(animationFrame * 0.2) * 0.1;
                const bombSize = gridSize * pulse;
                
                ctx.font = `${bombSize}px Arial`;
                ctx.fillText('💣', bomb.x + gridSize / 2, bomb.y + gridSize / 2);
            }
        }
    }

    // Calculate smooth snake positions for more fluid animation
    function calculateSmoothSnake() {
        if (snake.length <= 1) return snake;
        
        const smoothSnake = [snake[0]]; // Head stays the same
        
        // For each segment (except head), calculate a smoother position
        for (let i = 1; i < snake.length; i++) {
            const current = snake[i];
            const prev = snake[i-1];
            
            // Calculate direction vector
            const dx = prev.x - current.x;
            const dy = prev.y - current.y;
            
            // Calculate distance
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // If segments are at the right distance, keep as is
            if (distance <= gridSize) {
                smoothSnake.push(current);
                continue;
            }
            
            // Otherwise, create a new position that's closer to the previous segment
            const targetDistance = gridSize * snakeSegmentSpacing;
            const ratio = targetDistance / distance;
            
            const newX = prev.x - dx * ratio;
            const newY = prev.y - dy * ratio;
            
            smoothSnake.push({
                x: newX,
                y: newY
            });
        }
        
        return smoothSnake;
    }

    // Explode bomb animation with mushroom cloud
    function explodeBomb(bomb) {
        gameActive = false;
        clearInterval(gameInterval);
        
        // Animation for mushroom cloud explosion
        let explosionSize = 0;
        const maxSize = Math.max(canvasWidth, canvasHeight) * 1.5;
        const explosionSpeed = 5;
        
        const explosionInterval = setInterval(() => {
            // Clear the entire canvas
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Draw mushroom cloud explosion
            explosionSize += explosionSpeed;
            
            // Draw the mushroom cloud
            ctx.save();
            ctx.globalAlpha = Math.min(1, 2 - explosionSize / maxSize); // Fade out as it grows
            ctx.drawImage(
                mushroomCloudImg, 
                bomb.x + gridSize/2 - explosionSize/2, 
                bomb.y + gridSize/2 - explosionSize/2, 
                explosionSize, 
                explosionSize
            );
            ctx.restore();
            
            // Add shockwave effect
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.8 - explosionSize / maxSize) + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bomb.x + gridSize/2, bomb.y + gridSize/2, explosionSize * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            
            // Add text effect
            if (explosionSize < maxSize * 0.5) {
                ctx.save();
                ctx.fillStyle = 'rgba(255, 0, 0, ' + (1 - explosionSize / (maxSize * 0.5)) + ')';
                ctx.font = 'bold ' + (20 + explosionSize / 10) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('BOOM!', canvasWidth / 2, canvasHeight / 2);
                ctx.restore();
            }
            
            // End animation when explosion fills the screen
            if (explosionSize >= maxSize) {
                clearInterval(explosionInterval);
                gameOver();
            }
        }, 16); // ~60fps
    }

    // Game over
    function gameOver() {
        gameActive = false;
        clearInterval(gameInterval);
        finalScoreElement.textContent = score;
        gameOverElement.classList.remove('hidden');
    }

    // Game loop
    function gameLoop() {
        if (!paused && gameActive) {
            update();
            render();
        }
    }

    // Start game
    function startGame() {
        if (!gameActive) {
            init();
            gameActive = true;
            gameInterval = setInterval(gameLoop, gameSpeed);
            startButton.textContent = 'Restart Game';
        } else {
            // Restart game
            clearInterval(gameInterval);
            init();
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                // Pause/resume game
                paused = !paused;
                break;
        }
        
        // Prevent default behavior for arrow keys (scrolling)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            option.classList.add('active');
            
            // Set snake color
            const color = option.dataset.color;
            
            // Update SVG colors in the data URLs based on selection
            updateSnakeImages(getHexColor(color));
            
            // Redraw snake if game is active
            if (gameActive) {
                render();
            }
        });
    });
    
    // Get hex color from color name
    function getHexColor(colorName) {
        switch (colorName) {
            case 'green':
                return '#4CAF50';
            case 'blue':
                return '#2196F3';
            case 'red':
                return '#F44336';
            case 'purple':
                return '#9C27B0';
            case 'yellow':
                return '#FFEB3B';
            default:
                return '#4CAF50';
        }
    }
    
    // Update snake images with the selected color
    function updateSnakeImages(hexColor) {
        snakeColor = hexColor;
        
        // Update SVG data URLs with new color
        snakeHeadImg.src = createColoredSVG(baseSVGs.head, hexColor);
        snakeBodyImg.src = createColoredSVG(baseSVGs.body, hexColor);
        snakeTailImg.src = createColoredSVG(baseSVGs.tail, hexColor);
    }

    // Helper functions for color manipulation
    function darkenColor(color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const darkenFactor = 0.7;
        
        const newR = Math.floor(r * darkenFactor);
        const newG = Math.floor(g * darkenFactor);
        const newB = Math.floor(b * darkenFactor);
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    function lightenColor(color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const lightenFactor = 1.3;
        
        const newR = Math.min(255, Math.floor(r * lightenFactor));
        const newG = Math.min(255, Math.floor(g * lightenFactor));
        const newB = Math.min(255, Math.floor(b * lightenFactor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        adjustCanvasSize();
        if (gameActive) {
            render();
        }
    });

    // Initialize high score display
    highScoreElement.textContent = highScore;
    
    // Initial canvas setup
    adjustCanvasSize();
}); 