# TCP (Transmission Control Protocol)

## What is TCP?

TCP is a core foundational protocol of the Internet Protocol suite that provides reliable, ordered, and error-checked delivery of a stream of octets (bytes) between applications running on hosts communicating via an IP network. Unlike UDP, TCP establishes a connection via a handshake before data transfer and ensures no data is lost or corrupted.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `nc -v <host> <port>` | Netcat command used to establish a TCP connection with a remote host and port | 
| `ss -l -t` | Linux utility to display listening TCP sockets and connection states | 
| `iperf -c <host>` | Tests TCP network bandwidth and throughput against a target server | 
| `tcpdump -i eth0 tcp` | Captures and inspects live TCP network traffic on a specific network interface | 

# Quick Reference Links

* [Internet Assigned Numbers Authority (IANA) Port Service and Well-Known Port Numbers Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

* [RFC 793 - Transmission Control Protocol Specification](https://datatracker.ietf.org/doc/html/rfc793)

# Hyperlinks

| Internet Assigned Numbers Authority (IANA) Port Service and Well-Known Port Numbers Registry | https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml | | RFC 793 - Transmission Control Protocol Specification | https://datatracker.ietf.org/doc/html/rfc793 |

# Mouse Over Information

| **Word** | **Information** | 
| TCP | transmission control protocol, a reliable, connection-oriented transport layer protocol | 
| protocol | a set of rules or procedures for transmitting data between electronic devices | 
| connection-oriented | a communication method where a dedicated session or connection is established before data is transmitted | 
| reliable | a characteristic of data transfer ensuring packets arrive without loss, corruption, or duplication | 
| handshake | a preliminary signaling process used to establish a secure or authenticated communication channel between devices | 
| packet | a formatted unit of data carried by a packet-switched network | 
| port | a virtual endpoint used by operating systems to manage specific network connections and services | 
| socket | an internal endpoint for sending or receiving data across a computer network | 

# Tags

`tcp`, `network`, `transport`, `protocol`, `connection-oriented`, `networking`, `internet`, `socket`, `tcp-ip`, `reliability`

# Dependencies

Network Stack, TCP/IP, Ethernet, Operating System Kernel, Network Interface Card (NIC), Router