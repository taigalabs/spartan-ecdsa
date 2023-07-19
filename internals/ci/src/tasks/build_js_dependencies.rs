use crate::{paths::PATHS, task::Task, tasks::JS_ENGINE, BuildHandle, CiError};
use std::process::Command;

pub struct BuildJsDependenciesTask;

impl Task for BuildJsDependenciesTask {
    fn name(&self) -> &str {
        "build_js_dependencies"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let dependencies = ["externals/incremental-merkle-tree"];

        for dep in dependencies {
            let dependency_path = PATHS.curr_dir.join(dep);
            println!("dependency_path: {:?}", dependency_path);

            let status = Command::new(JS_ENGINE)
                .current_dir(dependency_path)
                .args(["run", "build-pkg"])
                .status()
                .expect(&format!("{} command failed to start", JS_ENGINE));

            assert!(status.success());
        }

        Ok(())
    }
}
