pub struct MerkleTree {}

impl MerkleTree {
    pub fn a() {}
}

#[derive(Debug, Clone)]
pub struct MerklePath {
    // Node idx at height
    pub idx: u128,

    // Relative position of sibling to curr node. e.g. 0_0 has 0_1 sibling with
    // direction "false"
    pub direction: bool,

    // Node location, e.g. 0_1 refers to the second node in the lowest height
    pub node_loc: String,
}

pub fn generate_auth_paths(idx: u128) -> Vec<MerklePath> {
    let height = 32;
    let mut auth_path = vec![];
    let mut curr_idx = idx;

    for h in 0..height {
        let sibling_idx = get_sibling_idx(curr_idx);

        let sibling_dir = if sibling_idx % 2 == 0 { true } else { false };

        let p = MerklePath {
            idx: sibling_idx,
            direction: sibling_dir,
            node_loc: format!("{}_{}", h, sibling_idx),
        };

        auth_path.push(p);

        let parent_idx = get_parent_idx(curr_idx);
        curr_idx = parent_idx;
    }

    auth_path
}

fn get_sibling_idx(idx: u128) -> u128 {
    if idx % 2 == 0 {
        idx + 1
    } else {
        idx - 1
    }
}

pub fn get_parent_idx(idx: u128) -> u128 {
    idx / 2
}
