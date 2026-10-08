# UDP (User Datagram Protocol)

## What is UDP?

UDP is a core communication protocol of the Internet Protocol suite used for time-sensitive transmissions by sending data packets (datagrams) with minimal overhead. Unlike TCP, UDP is connectionless and does not guarantee delivery, ordering, or error-checking, making it ideal for real-time applications like streaming, gaming, and VoIP.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `nc -u <host> <port>` | Netcat command used to send or receive UDP packets to a specific host and port | 
| `iperf -u -c <host>` | Tests UDP network throughput and performance against a target server | 
| `ss -l -u` | Linux utility to display listening UDP sockets on the system | 
| `tcpdump -i eth0 udp` | Captures and inspects live UDP network traffic on a specific network interface | 

# Quick Reference Links

* [Internet Assigned Numbers Authority (IANA) Port Service and Well-Known Port Numbers Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

* [RFC 768 - User Datagram Protocol Specification](https://datatracker.ietf.org/doc/html/rfc768)

# Hyperlinks

| Internet Assigned Numbers Authority (IANA) Port Service and Well-Known Port Numbers Registry | https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml |
| RFC 768 - User Datagram Protocol Specification | https://datatracker.ietf.org/doc/html/rfc768 |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| UDP | user datagram protocol, a lightweight connectionless transport layer protocol | 
| protocol | a set of rules or procedures for transmitting data between electronic devices | 
| datagram | a basic transfer unit associated with a packet-switched network | 
| connectionless | a communication type where data is sent without establishing a pre-defined session | 
| packet | a formatted unit of data carried by a packet-switched network | 
| port | a virtual endpoint used by operating systems to manage specific network connections and services | 
| socket | an internal endpoint for sending or receiving data across a computer network | 
| overhead | extra processing or data transmission required to maintain network communication | 

# Tags

`udp`, `network`, `transport`, `protocol`, `packet`, `datagram`, `tcp-ip`, `networking`, `internet`, `socket`

# Dependencies

Network Stack, TCP/IP, Ethernet, Operating System Kernel, Network Interface Card (NIC), Router