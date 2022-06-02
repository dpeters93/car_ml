/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
const saveBtn = document.getElementById('saveCar')
const deleteBtn = document.getElementById('deleteCar')

saveBtn.addEventListener('click', () => {
    save()
})

deleteBtn.addEventListener('click', () => {
    discard()
})

carCanvas.width = 200
networkCanvas.width = 300

const ctx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * .9, 3)

const cars = generateCars(1000)
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))

        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.3)
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -50, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -300, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -700, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -800, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -900, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -1000, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -700, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -1200, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -800, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -2000, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -2200, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -2400, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -2100, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -3000, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -3900, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -3000, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -3700, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -3200, 25, 45, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -3800, 25, 45, 'DUMMY', 2),
]

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem('bestBrain')
}

animate()

function generateCars(N) {
    const generatedCars = [];
    for (let i = 0; i <= N; i++) {
        generatedCars.push(
            new Car(road.getLaneCenter(1), 100, 25, 45, 'AI')
        )
    }
    return generatedCars;
}

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c2 => c2.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -bestCar.y + carCanvas.height * 0.7)

    road.draw(ctx)
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, 'red')
    }

    ctx.globalAlpha = 0.2
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(ctx, 'blue');
    }
    ctx.globalAlpha = 1
    bestCar.draw(ctx, 'blue', true);

    ctx.restore()

    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}