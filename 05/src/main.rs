use nannou::prelude::*;

mod vehicle;
mod flowfield;
use vehicle::*;
use flowfield::*;

const WIDTH: u32 = 1920;
const HEIGHT: u32 = 1080;
const RESOLUTION: f32 = 15.0;
const NUM_VEHICLES: usize = 500;

enum EdgeType {
    Bounce,
    Wrap,
    Ignore,
}

struct Model {
    flow_field: FlowField,
    vehicles: Vec<Vehicle>,
    edge: EdgeType,
    trails: bool,
    debug: bool,
}

fn main() {
    nannou::app(model).update(update).run();
}

fn model(app: &App) -> Model {
    let _window = app.new_window()
                .title(app.exe_name().unwrap())
                .size(WIDTH, HEIGHT)
                .clear_color(SNOW)
                .view(view)
                .key_pressed(key_pressed)
                .mouse_pressed(mouse_pressed)
                .build()
                .unwrap();
    let flow_field = FlowField::new(WIDTH as f32, HEIGHT as f32, RESOLUTION);
    let mut vehicles = Vec::new();
    for _ in 0..NUM_VEHICLES {
        let loc = pt2(random_range(0.0, WIDTH as f32), random_range(0.0, HEIGHT as f32));
        let vehicle = Vehicle::new(VehicleType::TRI, loc, vec2(-2.0, 0.5), 8.0, 3.0, 0.1);
        vehicles.push(vehicle);
    }
    let edge = EdgeType::Wrap;
    let trails = true;
    let debug = false;
    Model {
        flow_field,
        vehicles,
        edge,
        trails,
        debug,
    }
}

fn update(app: &App, model: &mut Model, _update: Update) {
    let win = app.window_rect();
    for vehicle in model.vehicles.iter_mut() {
        let force = vehicle.follow(&model.flow_field);
        vehicle.apply_force(force);
        vehicle.update();
        match model.edge {
            EdgeType::Wrap => vehicle.wrap(win),
            EdgeType::Bounce => vehicle.bounce(win),
            EdgeType::Ignore => {}
        }
    }
    model.flow_field.update();
}

fn view(app: &App, model: &Model, frame: Frame) {
    let draw = app.draw();
    if model.trails {
        let win = app.window_rect();
        draw.rect()
            .color(nannou::color::Alpha {color: SNOW, alpha: 0.01})
            .xy(win.xy())
            .wh(win.wh())
            ;
    } else {
        draw.background().color(SNOW);
    }

    if model.debug {
        model.flow_field.display(&draw);
    }
    for vehicle in model.vehicles.iter() {
        vehicle.display(&draw);
    }

    draw.to_frame(app, &frame).unwrap();
}

fn key_pressed(app: &App, model: &mut Model, key: Key) {
    match key {
        Key::B => {
            model.edge = EdgeType::Bounce;
        }
        Key::D => {
            model.debug = !model.debug;
        }
        Key::I => {
            model.edge = EdgeType::Ignore;
        }
        Key::R => {
            let win = app.window_rect();
            model.flow_field = FlowField::new(win.w(), win.h(), RESOLUTION);
            model.vehicles = Vec::new();
            for _ in 0..NUM_VEHICLES {
                let loc = pt2(random_range(0.0, WIDTH as f32), random_range(0.0, HEIGHT as f32));
                let vehicle = Vehicle::new(VehicleType::TRI, loc, vec2(-2.0, 0.5), 8.0, 3.0, 0.1);
                model.vehicles.push(vehicle);
            }
        }
        Key::T => {
            model.trails = !model.trails;
        }
        Key::W => {
            model.edge = EdgeType::Wrap;
        }
        _other_key => {}
    }
}

fn mouse_pressed(app: &App, model: &mut Model, _button: MouseButton) {
    let vehicle = Vehicle::new(VehicleType::TRI, app.mouse.position(), Vec2::ZERO, 8.0, random_range(2.0, 5.0), random_range(0.1, 2.0));
    model.vehicles.push(vehicle);
}
