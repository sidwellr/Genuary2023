use nannou::prelude::*;
use nannou::noise::{Seedable, NoiseFn};
use array2d::Array2D;

#[derive(Debug, Clone)]
pub struct FlowField {
    pub resolution: f32,
    pub rows: usize,
    pub cols: usize,
    pub field: Array2D::<Vec2>,
    pub t: f64,
    pub noise: nannou::noise::Perlin,
}

impl FlowField {
    pub fn new(width: f32, height: f32, resolution: f32) -> Self {
        let noise = nannou::noise::Perlin::new().set_seed(random_range(1,1000000));
        let rows = (width / resolution) as usize;
        let cols = (height / resolution) as usize;
        let mut field = Array2D::filled_with(Vec2::ZERO, rows, cols);
        let t = 0.0;
        FlowField::init(&mut field, rows, cols, t, noise);
        FlowField {
            resolution,
            rows,
            cols,
            field,
            t,
            noise,
        }
    }

    fn init(field: &mut Array2D::<Vec2>, rows: usize, cols: usize, t: f64, noise: nannou::noise::Perlin) {
        let mut xoff = 0.0;
        for j in 0..cols {
            let mut yoff = 0.0;
            for i in 0..rows {
                let angle = map_range(noise.get([xoff, yoff, t]), -1.0, 1.0, 0.0, 2.0 * TAU);
                field[(i, j)] = Vec2::new(angle.cos(), angle.sin());
                yoff += 0.075;
            }
            xoff += 0.075;
        }
    }

    pub fn update(&mut self) {
        self.t += 0.002;
        FlowField::init(&mut self.field, self.rows, self.cols, self.t, self.noise);
    }

    pub fn lookup(&self, loc: Point2) -> Vec2 {
        let row = clamp((loc.x / self.resolution + self.rows as f32 / 2.0) as usize, 0, self.rows - 1);
        let col = clamp((loc.y / self.resolution + self.cols as f32 / 2.0) as usize, 0, self.cols - 1);
        self.field[(row, col)]
    }

    pub fn display(&self, draw: &Draw) {
        for j in 0..self.cols {
            for i in 0..self.rows {
                let val = self.field[(i, j)];
                draw.arrow()
                    .color(BLUE)
                    .stroke_weight(1.0)
                    .points(Point2::X * -7.0, Point2::X * 7.0)
                    .x_y((i as f32 - self.rows as f32 / 2.0 + 0.5) * self.resolution, (j as f32 - self.cols as f32 / 2.0 + 0.5) * self.resolution)
                    .rotate(val.angle())
                    ;
            }
        }
    }
}
