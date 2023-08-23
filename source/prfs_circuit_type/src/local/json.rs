use prfs_entities::entities::{CircuitInputType, CircuitType};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitTypesJson2 {
    pub circuit_types: Vec<CircuitType>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitInputTypesJson2 {
    pub circuit_input_types: Vec<CircuitInputType>,
}
