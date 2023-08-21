use super::task::BuildTask;
use crate::{paths::PATHS, BuildHandle, CiError};
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::process::Command;

pub struct CompileCircuitsTask;

#[derive(Serialize, Deserialize)]
pub struct AssetsJson {
    pub files: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Circuit {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
}

impl BuildTask for CompileCircuitsTask {
    fn name(&self) -> &str {
        "CompileCircuitsTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        run_app();

        Ok(())
    }
}

fn run_app() {
    let bin = "cargo";

    let circuit_starting_idx = 0;

    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_circuit_circom)
        .args([
            "run",
            "-p",
            "prfs_circuit_circom",
            "--",
            "--circuit-id",
            &circuit_starting_idx.to_string(),
        ])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
