// use http_body_util::{BodyExt, Full};
// use hyper::body::Bytes;

// pub type BytesBoxBody = http_body_util::combinators::BoxBody<Bytes, hyper::Error>;

// pub fn full<T: Into<Bytes>>(chunk: T) -> BytesBoxBody {
//     Full::new(chunk.into())
//         .map_err(|never| match never {})
//         .boxed()
// }
