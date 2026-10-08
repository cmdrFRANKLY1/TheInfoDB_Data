# PING (Packet Internet Groper)

## What is PING?

The `ping` command is a standard network administration utility used in Unix, Linux, macOS, and Windows operating systems to test the reachability of a host on an Internet Protocol (IP) network and measure the round-trip time for messages sent from the originating host to a destination computer.

# Examples & Usage

| Command | Description | 
| ----- | ----- | 
| `ping <hostname-or-ip>` | Continuously sends ICMP echo request packets to the specified target until interrupted | 
| `ping -c 4 <hostname-or-ip>` | Sends a specified number (e.g., 4) of echo requests and then stops automatically | 
| `ping -i 5 <hostname-or-ip>` | Waits a specified number of seconds (e.g., 5) between sending each packet | 
| `ping -t <hostname-or-ip>` | Continuously pings the target until stopped manually (common syntax in Windows) | 

# Quick Reference Links

* [Network Working Group ICMP Specification](https://www.ietf.org/rfc/rfc792.txt)

* [Linux Man Pages Ping Documentation](https://man7.org/linux/man-pages/man8/ping.8.html)

# Hyperlinks

| Network Working Group ICMP Specification | https://www.ietf.org/rfc/rfc792.txt |
| Linux Man Pages Ping Documentation | https://man7.org/linux/man-pages/man8/ping.8.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| ping | packet internet groper, a network utility used to test host reachability and latency | 
| network | a collection of computers, servers, and devices connected to share resources and data | 
| IP | internet protocol, a set of rules governing the format of data sent via the internet or local network | 
| packet | a formatted unit of data carried by a packet-switched network | 
| ICMP | internet control message protocol, a supporting protocol used for network error reporting and diagnostics | 
| host | a computer or other device connected to a computer network | 
| latency | the time delay between the initiation of a network request and its receipt | 
| router | a networking device that forwards data packets between computer networks | 

# Tags

`ping`, `network`, `connectivity`, `icmp`, `troubleshooting`, `latency`, `diagnostics`, `ip`, `packet`, `command-line`, `windows`, `linux`

# Dependencies

Linux, Unix, macOS, Windows, PowerShell, CMD, Shell, Bash, Console, Terminal, Network Stack, TCP/IP