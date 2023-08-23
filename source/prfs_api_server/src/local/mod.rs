// use colored::Colorize;
// use prfs_circuit_circom::{CircuitBuildJson, CircuitBuildListJson};
// use prfs_circuit_type::local::access::{
//     load_system_native_circuit_input_types, load_system_native_circuit_types,
// };
// use prfs_driver_type::local::access::load_system_native_driver_types;
// use prfs_entities::{
//     entities::{CircuitDriver, CircuitInputType, CircuitType},
//     syn_entities::PrfsCircuitSyn1,
// };
// use std::{
//     collections::{HashMap, HashSet},
//     path::PathBuf,
// };

// pub struct LocalAssets {
//     pub syn_circuits: HashMap<String, PrfsCircuitSyn1>,
//     pub drivers: HashMap<String, CircuitDriver>,
//     pub circuit_types: HashMap<String, CircuitType>,
//     pub circuit_input_types: HashMap<String, CircuitInputType>,
// }

// pub fn load_local_assets() -> LocalAssets {
//     let circuit_types = load_circuit_types();
//     let circuit_input_types = load_circuit_input_types();
//     let syn_circuits = load_circuits(&circuit_types, &circuit_input_types);
//     let drivers = load_driver_types();

//     LocalAssets {
//         syn_circuits,
//         drivers,
//         circuit_types,
//         circuit_input_types,
//     }
// }

// fn load_circuits(
//     circuit_types: &HashMap<String, CircuitType>,
//     circuit_input_types: &HashMap<String, CircuitInputType>,
// ) -> HashMap<String, PrfsCircuitSyn1> {
//     let build_list_json = prfs_circuit_circom::access::read_circuit_artifacts();
//     let build_path = prfs_circuit_circom::access::get_build_fs_path();

//     let mut syn_circuits = HashMap::new();
//     let mut circuit_ids = HashSet::new();

//     for circuit_name in build_list_json.circuits {
//         let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
//         println!(
//             "Reading circuit, name: {:?}",
//             circuit_build_json_path.file_name()
//         );

//         let b = std::fs::read(circuit_build_json_path).unwrap();
//         let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

//         if circuit_ids.contains(&build_json.circuit.circuit_id.to_string()) {
//             panic!("Duplicate circuit id, build_json: {:?}", build_json);
//         }

//         let c = build_json.circuit;
//         let circuit_type = circuit_types.get(&c.circuit_type).unwrap();

//         let mut relevant_input_types = vec![];
//         for circuit_input in circuit_type.circuit_inputs_meta.iter() {
//             let circuit_input_type = circuit_input_types.get(&circuit_input.r#type).unwrap();
//             relevant_input_types.push(circuit_input_type.clone());
//         }

//         let syn_circuit = PrfsCircuitSyn1 {
//             circuit_id: c.circuit_id,
//             circuit_type: c.circuit_type,
//             label: c.label,
//             desc: c.desc,
//             author: c.author,
//             num_public_inputs: c.num_public_inputs,
//             circuit_dsl: c.circuit_dsl,
//             arithmetization: c.arithmetization,
//             proof_algorithm: c.proof_algorithm,
//             elliptic_curve: c.elliptic_curve,
//             finite_field: c.finite_field,
//             driver_id: c.driver_id,
//             driver_version: c.driver_version,
//             driver_properties: c.driver_properties,
//             circuit_inputs_meta: circuit_type.circuit_inputs_meta.clone(),
//             // circuit_input_types: relevant_input_types,
//             raw_circuit_inputs_meta: c.raw_circuit_inputs_meta,
//             created_at: c.created_at,
//         };

//         circuit_ids.insert(c.circuit_id.to_string());
//         syn_circuits.insert(circuit_name, syn_circuit);
//     }

//     syn_circuits
// }

// fn load_driver_types() -> HashMap<String, CircuitDriver> {
//     println!("\n{} circuit drivers", "Loading".green());

//     let drivers_json = load_system_native_driver_types();

//     let mut m = HashMap::new();
//     for pgm in drivers_json.drivers {
//         m.insert(pgm.driver_id.to_string(), pgm.clone());
//     }

//     return m;
// }

// fn load_circuit_types() -> HashMap<String, CircuitType> {
//     println!("\n{} circuit types", "Loading".green());

//     let circuit_types_json = load_system_native_circuit_types();

//     let mut m = HashMap::new();
//     for circuit_type in circuit_types_json.circuit_types {
//         println!("Reading circuit_type, name: {}", circuit_type.circuit_type);

//         m.insert(circuit_type.circuit_type.to_string(), circuit_type.clone());
//     }

//     return m;
// }

// fn load_circuit_input_types() -> HashMap<String, CircuitInputType> {
//     println!("\n{} circuit input types", "Loading".green());

//     let json = load_system_native_circuit_input_types();

//     let mut m = HashMap::new();
//     for input_type in json.circuit_input_types {
//         println!(
//             "Reading input_type, name: {}",
//             input_type.circuit_input_type
//         );

//         m.insert(
//             input_type.circuit_input_type.to_string(),
//             input_type.clone(),
//         );
//     }

//     return m;
// }
