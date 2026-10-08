# OSI Layer 3: Network Layer

## What is the Network Layer?

The Network Layer is the third layer of the Open Systems Interconnection (OSI) Model. It is responsible for routing data between different networks and ensuring that data packets find the best and most efficient path to their final destination. While Layer 2 (Data Link) handles node-to-node communication on the exact same local network, Layer 3 is what allows communication across multiple interconnected networks (like the Internet). It achieves this by using logical addressing (such as IP addresses) and relies heavily on networking hardware like routers to forward packets from a source host to a destination host.

# Examples & Usage

| Technology / Protocol | Description | 
| ----- | ----- | 
| **IP (Internet Protocol)** | The primary protocol in the TCP/IP suite used for relaying datagrams across network boundaries, establishing the internet (includes IPv4 and IPv6) | 
| **Routers** | Network hardware devices that operate at Layer 3, reading logical IP addresses to determine the best path to forward packets between disparate networks | 
| **ICMP (Internet Control Message Protocol)** | A supporting protocol used by network devices, like routers, to send error messages and operational information (e.g., utilized by the `ping` command) | 
| **IPsec (Internet Protocol Security)** | A secure network protocol suite that authenticates and encrypts packets of data to provide secure communication at Layer 3 (commonly used in VPNs) | 
| **Routing Protocols (OSPF, BGP)** | Automated protocols that routers use to communicate with each other, share network topology information, and dynamically discover the best paths | 

# Quick Reference Links

* [Cloudflare: What is the Network Layer?](https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/)

* [GeeksforGeeks: Network Layer in OSI Model](https://www.geeksforgeeks.org/network-layer-in-osi-model/)

* [IBM: Network Layer Overview](https://www.ibm.com/docs/en/aix/7.2?topic=protocol-network-layer)

# Hyperlinks

| Cloudflare: What is the Network Layer? | https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/ |
| GeeksforGeeks: Network Layer in OSI Model | https://www.geeksforgeeks.org/network-layer-in-osi-model/ |
| IBM: Network Layer Overview | https://www.ibm.com/docs/en/aix/7.2?topic=protocol-network-layer |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| Network Layer | Layer 3 of the OSI model, responsible for packet forwarding and routing across multiple networks | 
| packet | a formatted unit of data carried by a packet-switched network, the primary data unit of Layer 3 | 
| IP address | a logical numerical label assigned to a device connected to a computer network for identification and location | 
| router | a networking device that forwards data packets between computer networks based on IP addresses | 
| routing | the process of selecting a path for network traffic between or across multiple interconnected networks | 
| logical addressing | assigning a software-based address (like an IP) to a device, independent of its physical hardware address (MAC) | 
| ICMP | internet control message protocol, used for network diagnostic and error-reporting purposes | 
| subnet | a logical subdivision of an IP network used to improve routing efficiency and network security | 
| IPv4 | internet protocol version 4, a widely used 32-bit addressing scheme | 
| IPv6 | internet protocol version 6, the successor to IPv4 featuring a vastly larger 128-bit addressing scheme | 

# Tags

`osi`, `layer-3`, `network-layer`, `routing`, `ip-address`, `router`, `networking`, `packet`, `ipv4`, `ipv6`, `infrastructure`

# Dependencies

Networking Hardware, Routers, IPv4, IPv6, Data Link Layer (Layer 2), Transport Layer (Layer 4)