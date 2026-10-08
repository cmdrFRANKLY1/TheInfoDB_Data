# OSI Layer 5: Session Layer

## What is the Session Layer?

The Session Layer is the fifth layer of the Open Systems Interconnection (OSI) Model. It is responsible for establishing, managing, synchronizing, and terminating communication sessions between two end-user applications or host devices. It handles "dialog control," which dictates how and when devices communicate (such as full-duplex or half-duplex transmission). Additionally, this layer inserts checkpoints into data streams, allowing for seamless recovery and synchronization so that if a network failure occurs, the transmission can resume from the last successful checkpoint rather than starting over entirely.

# Examples & Usage

| 

| **Technology / Protocol** | **Description** | 
| **NetBIOS** | A network basic input/output system API that allows applications on separate computers to communicate over a local area network | 
| **RPC (Remote Procedure Call)** | A protocol that allows a computer program to execute a subroutine or procedure in another address space (commonly on a shared network) | 
| **PPTP (Point-to-Point Tunneling Protocol)** | A network protocol used to implement virtual private network (VPN) tunnels, managing the connection session | 
| **Dialog Control** | The mechanism that determines whether the communication between devices is simplex, half-duplex, or full-duplex | 
| **Checkpointing (Synchronization)** | The process of adding synchronization points into large data streams to ensure data can be recovered without restarting the entire download | 

# Quick Reference Links

* [GeeksforGeeks: Session Layer in OSI Model](https://www.geeksforgeeks.org/session-layer-in-osi-model/)

* [IBM: Session Layer Overview](https://www.ibm.com/docs/en/aix/7.2?topic=protocol-session-layer)

* [Cloudflare: What is the OSI Model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)

# Hyperlinks

| GeeksforGeeks: Session Layer in OSI Model | https://www.geeksforgeeks.org/session-layer-in-osi-model/ | | IBM: Session Layer Overview | https://www.ibm.com/docs/en/aix/7.2?topic=protocol-session-layer | | Cloudflare: What is the OSI Model? | https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/ |

# Mouse Over Information

| **Word** | **Information** | 
| Session Layer | Layer 5 of the OSI model, responsible for establishing, managing, and terminating communication sessions | 
| session | a temporary, interactive information interchange between two or more communicating devices or applications | 
| dialog control | a mechanism that regulates the direction and flow of communication between two networked systems | 
| synchronization | the process of keeping multiple systems or continuous data streams perfectly aligned and up to date | 
| checkpoint | a designated marker in a data stream used for recovery, allowing transmission to resume after an interruption | 
| NetBIOS | an API that provides services related to the session layer, allowing applications to communicate over a LAN | 
| RPC | remote procedure call, a protocol used to request a service from a program located on another network computer | 
| full-duplex | a communication mode where data can be transmitted and received in both directions simultaneously | 
| half-duplex | a communication mode where data can flow in both directions, but only one direction at a time | 

# Tags

`osi`, `layer-5`, `session-layer`, `netbios`, `rpc`, `networking`, `dialog-control`, `synchronization`, `infrastructure`, `communication`

# Dependencies

Transport Layer (Layer 4), Presentation Layer (Layer 6), Operating System, Application APIs