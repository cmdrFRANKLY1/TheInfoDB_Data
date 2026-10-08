# OSI Layer 2: Data Link Layer

## What is the Data Link Layer?

The Data Link Layer is the second layer of the Open Systems Interconnection (OSI) Model. It is responsible for the reliable node-to-node delivery of data across a physical network. It takes the raw bit streams from the Physical Layer (Layer 1) and organizes them into logical units called "frames." This layer is crucial for physical addressing (using MAC addresses), network topology, network access, and error detection. It is conceptually divided into two sublayers: Logical Link Control (LLC) for multiplexing protocols, and Media Access Control (MAC) for interacting with the physical transmission medium.

# Examples & Usage

| Technology / Device | Description | 
| ----- | ----- | 
| **MAC Address** | A 48-bit unique hardware identifier assigned to a Network Interface Card (NIC) for physical network communications | 
| **Network Switches** | Hardware devices that operate at Layer 2, using MAC addresses to forward data frames only to the specific intended destination | 
| **Ethernet (IEEE 802.3)** | The dominant protocol standard for wired Local Area Networks (LANs), defining how data is formatted and transmitted | 
| **VLAN (Virtual LAN)** | A logical grouping of network devices that behave as if they are on the same local network, regardless of physical location | 
| **ARP (Address Resolution Protocol)** | A protocol used to translate a logical Layer 3 IP address into a physical Layer 2 MAC address | 

# Quick Reference Links

* [GeeksforGeeks: Data Link Layer in OSI Model](https://www.geeksforgeeks.org/data-link-layer/)

* [IBM: Data Link Layer Overview](https://www.ibm.com/docs/en/aix/7.2?topic=protocol-data-link-layer)

* [Cisco: Switches and Layer 2 Networks](https://www.cisco.com/c/en/us/solutions/enterprise-networks/switches/what-is-a-network-switch.html)

# Hyperlinks

| GeeksforGeeks: Data Link Layer in OSI Model | https://www.geeksforgeeks.org/data-link-layer/ |
| IBM: Data Link Layer Overview | https://www.ibm.com/docs/en/aix/7.2?topic=protocol-data-link-layer |
| Cisco: Switches and Layer 2 Networks | https://www.cisco.com/c/en/us/solutions/enterprise-networks/switches/what-is-a-network-switch.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| Data Link Layer | Layer 2 of the OSI model, responsible for node-to-node data transfer and error detection | 
| frame | a digital data transmission unit specific to Layer 2, containing headers, data, and trailers | 
| MAC address | media access control address, a unique physical identifier assigned to a network interface controller | 
| LLC | logical link control, a sublayer that multiplexes protocols running on top of the Data Link Layer | 
| MAC | media access control, a sublayer that controls how devices on a network gain access to the medium | 
| switch | a networking hardware device that receives and forwards data to the destination device based on MAC addresses | 
| Ethernet | a family of wired computer networking technologies commonly used in local area networks (LANs) | 
| VLAN | virtual local area network, a custom segmented network created logically rather than physically | 
| ARP | address resolution protocol, used for discovering the link layer address (MAC) associated with a given internet layer address (IP) | 

# Tags

`osi`, `layer-2`, `data-link`, `mac-address`, `switching`, `ethernet`, `networking`, `vlan`, `frames`, `hardware`

# Dependencies

Networking Hardware, Network Interface Card (NIC), Ethernet, Network Switches, Physical Layer (Layer 1)