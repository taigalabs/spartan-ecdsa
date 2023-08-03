use crate::{
    build_handle::BuildHandle,
    build_task::{
        build_js_dependencies::BuildJsDependenciesTask,
        build_prfs_program_spartan_js::BuildPrfsProgramSpartanJsTask,
        build_prfs_program_spartan_wasm::BuildPrfsProgramSpartanWasmTask,
        compile_circuits::CompileCircuitsTask, task::BuildTask,
    },
    paths::PATHS,
    CiError,
};
use clap::ArgMatches;
use colored::Colorize;

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![
        Box::new(BuildPrfsProgramSpartanWasmTask),
        Box::new(CompileCircuitsTask),
        Box::new(BuildJsDependenciesTask),
        Box::new(BuildPrfsProgramSpartanJsTask),
    ];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}

fn run_tasks(
    _matches: &ArgMatches,
    tasks: Vec<Box<dyn BuildTask>>,
    mut build_handle: BuildHandle,
) -> Result<(), CiError> {
    for t in &tasks {
        println!(
            "\n{} executing task: {}",
            "Start".green().bold(),
            t.name().cyan().bold()
        );

        match t.run(&mut build_handle) {
            Ok(_) => (),
            Err(err) => {
                println!(
                    "Error executing task, {}, err: {}",
                    t.name(),
                    err.to_string()
                );

                return Err(err);
            }
        }
    }

    println!(
        "{} building, tasks done: {}",
        "Success".green(),
        tasks.len()
    );

    Ok(())
}
