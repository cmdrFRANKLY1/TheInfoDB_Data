# OSI Model (Open Systems Interconnection)

## What is the OSI Model?

The OSI (Open Systems Interconnection) Model is a conceptual framework created by the International Organization for Standardization (ISO). It is used to understand, describe, and standardize the functions of a telecommunication or computing network system into seven distinct logical layers. While modern networks primarily rely on the TCP/IP model, the OSI model remains the universal language used by IT professionals to troubleshoot network issues, discuss architecture, and explain how different hardware and software protocols interact.

# OSI Layers

| Layer / Name | Description | Example Protocols & Devices | 
| ----- | ----- | ----- | 
| **Layer 7: Application** | The layer closest to the end user. It provides network services directly to software applications and user interfaces. | HTTP, HTTPS, FTP, SMTP, DNS, Web Browsers | 
| **Layer 6: Presentation** | Responsible for data translation, formatting, encryption/decryption, and compression to prepare it for the application layer. | SSL/TLS, ASCII, JPEG, MPEG | 
| **Layer 5: Session** | Establishes, maintains, and terminates communication sessions between two computers. | NetBIOS, PPTP, RPC | 
| **Layer 4: Transport** | Handles the reliable or unreliable delivery of data across a network, including error-checking and data segmentation. | TCP, UDP, Port Numbers | 
| **Layer 3: Network** | Responsible for logical addressing, routing data packets between different networks, and determining the best path. | IPv4, IPv6, ICMP, IPsec, Routers | 
| **Layer 2: Data Link** | Facilitates node-to-node data transfer across a physical link and handles physical addressing (MAC addresses). | Ethernet, MAC, VLAN, Switches | 
| **Layer 1: Physical** | The physical and electrical characteristics of the network. It transmits raw bit streams over a physical medium. | Fiber optics, Copper cables, Wi-Fi, Hubs | 

# Quick Reference Links

* [Cloudflare: What is the OSI Model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)

* [Cisco: What Is the OSI Model?](https://www.cisco.com/c/en/us/solutions/enterprise-networks/what-is-osi-model.html)

* [Imperva: OSI Model Guide](https://www.imperva.com/learn/application-security/osi-model/)

# Hyperlinks

| Cloudflare: What is the OSI Model? | https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/ |
| Cisco: What Is the OSI Model? | https://www.cisco.com/c/en/us/solutions/enterprise-networks/what-is-osi-model.html |
| Imperva: OSI Model Guide | https://www.imperva.com/learn/application-security/osi-model/ |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| OSI | Open Systems Interconnection, a conceptual model that characterizes and standardizes communication functions | 
| framework | a basic conceptual structure used to solve or address complex issues | 
| layer | a distinct logical division in a network architecture, abstracting specific communication functions | 
| protocol | a set of rules or procedures for transmitting data between electronic devices | 
| routing | the process of selecting a path for network traffic between or across multiple networks | 
| IP address | a logical numerical label assigned to a device connected to a computer network | 
| MAC address | media access control address, a unique physical identifier assigned to a network interface controller | 
| encapsulation | the process of adding headers and trailers to data as it moves down the OSI layers | 
| TCP/IP | a suite of communication protocols used to interconnect network devices on the internet | 
| node | a connection point, redistribution point, or communication endpoint within a network | 

# Tags

`osi`, `model`, `networking`, `network-stack`, `protocols`, `tcp-ip`, `layers`, `telecommunications`, `infrastructure`, `troubleshooting`

# Dependencies

Networking Hardware, Network Stack, TCP/IP Suite, Network Interface Card (NIC), Ethernet, Operating System