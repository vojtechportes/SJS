# Benchmarks

| s.modern.js |
| ----------- |
| Injecting 1000 elements take ca 8ms - 23ms |
| Adding class to 1000 elements take ca 2ms - 4ms |
| Adding event to 1000 elements take ca 9ms - 17ms |
| Removing events from 1000 elements and removing 1000 elements take ca 10ms - 13ms |
| Posting request 1000 times take ca 11s |
| Get request 1000 times take ca 11s |

| jquery.1.11.2.min.js / jquery.2.0.0.min.js |
| ----------- |
| Injecting 1000 elements take ca 44ms - 63ms |
| Adding class to 1000 elements take ca 4ms - 5ms |
| Adding event to 1000 elements take ca 10ms - 17ms |
| Removing events from 1000 elements and removing 1000 elements take ca 18ms - 35ms |
| Posting request 1000 times take ca 11s |
| Get request 1000 times take ca 11s |

* Get and post requests are in async modes. In case of SJS, page is displayed in ca 120 - 500ms, in case of JQuery in 450 to 2000ms