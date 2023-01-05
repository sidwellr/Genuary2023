use nannou::prelude::*;
use crate::flowfield::*;

#[allow(dead_code)]
#[derive(Debug, Clone, Copy)]
pub enum VehicleType {
    TRI,
    CIRCLE,
}

#[derive(Debug, Clone, Copy)]
pub struct Vehicle {
    pub vehicle_type: VehicleType,
    pub location: Point2,
    pub velocity: Vec2,
    pub acceleration: Vec2,
    pub mass: f32,
    pub max_speed: f32,
    pub max_force: f32,
    pub wander_angle: f32,
    pub debug: Point2,
}

impl Vehicle {
    pub fn new(vehicle_type: VehicleType, location: Point2, velocity: Vec2, mass: f32, max_speed: f32, max_force: f32) -> Self {
        Vehicle {
            vehicle_type,
            location,
            velocity,
            acceleration: Vec2::ZERO,
            mass,
            max_speed,
            max_force,
            wander_angle: 0.0,
            debug: Point2::ZERO,
        }
    }

    #[allow(dead_code)]
    pub fn wrap(&mut self, rect: Rect) {
        if self.location.x < rect.x.start {
            self.location.x = rect.x.end;
        }
        if self.location.x > rect.x.end {
            self.location.x = rect.x.start;
        }
        if self.location.y < rect.y.start {
            self.location.y = rect.y.end;
        }
        if self.location.y > rect.y.end {
            self.location.y = rect.y.start;
        }
    }

    #[allow(dead_code)]
    pub fn bounce(&mut self, rect: Rect) {
        if self.location.x < rect.x.start + self.mass {
            self.location.x = rect.x.start + self.mass;
            self.velocity.x *= -1.0;
        }
        if self.location.x > rect.x.end - self.mass {
            self.location.x = rect.x.end - self.mass;
            self.velocity.x *= -1.0;
        }
        if self.location.y < rect.y.start + self.mass {
            self.location.y = rect.y.start + self.mass;
            self.velocity.y *= -1.0;
        }
        if self.location.y > rect.y.end - self.mass {
            self.location.y = rect.y.end - self.mass;
            self.velocity.y *= -1.0;
        }
    }

    pub fn update(&mut self) {
        self.velocity += self.acceleration.clamp_length_max(self.max_force);
        self.velocity = self.velocity.clamp_length_max(self.max_speed);
        self.location += self.velocity;
        self.acceleration = Vec2::ZERO;
    }

    pub fn apply_force(&mut self, force: Vec2) {
        self.acceleration += force / self.mass;
    }

    pub fn follow(&self, flow: &FlowField) -> Vec2 {
        let desired = flow.lookup(self.location).normalize_or_zero() * self.max_speed;
        let steer = (desired - self.velocity) * self.mass;
        steer
    }

    pub fn display(&self, draw: &Draw) {
        let theta;
        if self.velocity == Vec2::ZERO {
            theta = 0.0;
        } else {
            theta = self.velocity.angle() + PI / 2.0;
        }
        match self.vehicle_type {
            VehicleType::TRI => {
                draw.tri()
                    .color(GRAY)
                    .points(pt2(0.0, -self.mass * 2.0), pt2(-self.mass, self.mass * 2.0), pt2(self.mass, self.mass * 2.0))
                    .xy(self.location)
                    .rotate(theta)
                    ;
            }
            VehicleType::CIRCLE => {
                draw.ellipse()
                    .color(LIGHTGRAY)
                    .stroke(BLACK)
                    .stroke_weight(1.0)
                    .radius(self.mass)
                    .xy(self.location)
                    .rotate(theta)
                    ;
            }
        }
        if self.debug != Point2::ZERO {
            draw.ellipse()
                .color(GREEN)
                .radius(2.0)
                .xy(self.debug)
                ;
        }
    }
}
