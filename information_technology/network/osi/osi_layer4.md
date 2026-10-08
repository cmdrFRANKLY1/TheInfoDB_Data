# OSI Layer 4: Transport Layer

## What is the Transport Layer?

The Transport Layer is the fourth layer of the Open Systems Interconnection (OSI) Model. It is responsible for the reliable or unreliable end-to-end delivery of data between host computers. This layer takes data from the Session Layer (Layer 5), breaks it into smaller units called "segments" (or datagrams), and passes them to the Network Layer (Layer 3). It manages network traffic by controlling the flow of data, detecting and correcting errors, and multiplexing data from different applications using logical endpoints known as port numbers. 

# Examples & Usage

| Technology / Protocol | Description | 
| ----- | ----- | 
| **TCP (Transmission Control Protocol)** | A connection-oriented protocol that guarantees reliable, ordered, and error-checked delivery of data streams | 
| **UDP (User Datagram Protocol)** | A connectionless protocol used for time-sensitive transmissions (like video streaming or gaming) that prioritizes speed over reliability | 
| **Port Numbers** | Logical numerical identifiers (from 0 to 65535) used to direct network traffic to the correct application or service running on a host | 
| **Load Balancers (Layer 4)** | Network devices or software that distribute incoming traffic across multiple servers based on IP addresses and TCP/UDP port numbers | 
| **Segmentation and Reassembly** | The process of breaking large data messages down into smaller, manageable segments for transmission, and rebuilding them at the destination | 

# Quick Reference Links

* [Cloudflare: What is the Transport Layer?](https://www.cloudflare.com/learning/network-layer/what-is-the-transport-layer/)

* [GeeksforGeeks: Transport Layer in OSI Model](https://www.geeksforgeeks.org/transport-layer-in-osi-model/)

* [IBM: Transport Layer Overview](https://www.ibm.com/docs/en/aix/7.2?topic=protocol-transport-layer)

# Hyperlinks

| Cloudflare: What is the Transport Layer? | https://www.cloudflare.com/learning/network-layer/what-is-the-transport-layer/ |
| GeeksforGeeks: Transport Layer in OSI Model | https://www.geeksforgeeks.org/transport-layer-in-osi-model/ |
| IBM: Transport Layer Overview | https://www.ibm.com/docs/en/aix/7.2?topic=protocol-transport-layer |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| Transport Layer | Layer 4 of the OSI model, responsible for end-to-end communication and data stream management | 
| TCP | transmission control protocol, a reliable, connection-oriented transport layer protocol | 
| UDP | user datagram protocol, a lightweight connectionless transport layer protocol | 
| segment | a unit of data designated for the Transport layer, containing data and a transport header | 
| port | a virtual endpoint used by operating systems to manage specific network connections and services | 
| multiplexing | the process of combining multiple distinct communication sessions onto a single physical network connection | 
| connection-oriented | a communication method where a dedicated session is established and acknowledged before data is transmitted | 
| connectionless | a communication type where data is sent without establishing a pre-defined session or acknowledging receipt | 
| flow control | a mechanism that regulates the rate of data transmission to prevent a fast sender from overwhelming a slow receiver | 

# Tags

`osi`, `layer-4`, `transport-layer`, `tcp`, `udp`, `ports`, `networking`, `segments`, `reliability`, `infrastructure`

# Dependencies

Network Layer (Layer 3), IP (Internet Protocol), TCP, UDP, Operating System, Session Layer (Layer 5)