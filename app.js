/* ============================================
   StudyForge — Application Logic
   ============================================ */

// ===== INLINE SVG ICONS (works fully offline) =====
var ICO = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  grip: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
  trash: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clone: '<svg class="icon" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  question: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 9a.5.5 0 011 0c0 1-1 1.5-1 2.5M15 9a.5.5 0 011 0c0 1-1 1.5-1 2.5M8 15.5h8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  chevR: '<svg class="icon" style="width:0.7em;height:0.7em" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowL: '<svg class="icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowR: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  xmark: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  home: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5M5 9.5V20h14V9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rotate: '<svg class="icon" viewBox="0 0 24 24"><path d="M1 4v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shuffle: '<svg class="icon" viewBox="0 0 24 24"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  hand: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0v6M10 9.5V6a2 2 0 00-4 0v8l-1.5-1.5a2 2 0 00-2.83 2.83L7 21h10a2 2 0 002-2v-5a2 2 0 00-4 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trophy: '<svg class="icon" viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 01-2-2V6a2 2 0 012-2h2M18 9h2a2 2 0 002-2V6a2 2 0 00-2-2h-2M6 4h12v6a6 6 0 01-12 0V4zM9 20h6M12 16v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  okCirc: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  noCirc: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  puzzle: '<svg class="icon" viewBox="0 0 24 24"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 00-.293.707v.737a2.263 2.263 0 01-.697 1.634l-.464.464a2.263 2.263 0 01-1.634.697h-.737a.98.98 0 00-.707.293l-1.611 1.611a2.41 2.41 0 01-1.704.706 2.41 2.41 0 01-1.704-.706l-1.568-1.568a1.026 1.026 0 00-.877-.29h-.877a2.41 2.41 0 01-2.41-2.41v-.877c0-.325-.124-.637-.352-.867l-1.568-1.568A2.41 2.41 0 013 12.002c0-.618.236-1.234.706-1.704L5.317 8.687c.228-.23.352-.542.352-.867V6.944a2.41 2.41 0 012.41-2.41h.737c.257 0 .504-.1.686-.28l1.611-1.611A2.41 2.41 0 0112.817 2c.618 0 1.234.236 1.704.706l1.568 1.568c.23.228.542.352.867.352h.877a2.41 2.41 0 012.41 2.41v.877c0 .336.137.658.38.89l.516.516z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  book: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  exit: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  tfTrue: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tfFalse: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="var(--error)" stroke-width="2.5" stroke-linecap="round"/></svg>'
};

// ===== DATA BUILDERS =====
function MC(q, o, a) { return { type: 'multiple-choice', question: q, options: o, answer: a }; }
function IDQ(q, a) { return { type: 'identification', question: q, answer: a }; }
function TF(q, a) { return { type: 'true-false', question: q, answer: a }; }
function FB(q, a) { return { type: 'fill-blank', question: q, answer: a }; }
function FC(f, b) { return { front: f, back: b }; }

// ===== DEFAULT COURSE DATA =====
var DEFAULTS = [
  {
    id: 'ccna1', title: 'CCNA 1: Introduction to Networks',
    desc: 'Fundamentals of networking, OSI/TCP-IP models, IP addressing, and core protocols.',
    color: '#06d6a0',
    modules: [
      {
        id: 'm1', title: 'Network Fundamentals', flashcards: [
          FC('What is a LAN?', 'Local Area Network \u2014 connects devices within a limited geographic area such as a home, office, or building.'),
          FC('What is a WAN?', 'Wide Area Network \u2014 connects LANs across large geographic distances using service provider infrastructure.'),
          FC('What is a PAN?', 'Personal Area Network \u2014 connects devices within an individual\'s immediate vicinity, typically within 10 meters (e.g., Bluetooth).'),
          FC('What device forwards data packets between different networks?', 'A Router \u2014 operates at Layer 3 and uses routing tables to determine the best path for packets.'),
          FC('What device connects end devices in a LAN using MAC addresses?', 'A Switch \u2014 operates at Layer 2, builds a MAC address table, and forwards frames based on destination MAC.'),
          FC('What is a MAN?', 'Metropolitan Area Network \u2014 covers a city or large campus, larger than LAN but smaller than WAN.'),
          FC('What is bandwidth?', 'The maximum rate of data transfer across a network path, measured in bits per second (bps, Kbps, Mbps, Gbps).'),
          FC('What is latency?', 'The time delay between sending and receiving data across a network; measured in milliseconds.'),
          FC('What is throughput?', 'Actual data transfer rate achieved in practice, typically less than theoretical bandwidth due to overhead.'),
          FC('What is a protocol?', 'A set of rules governing data communication including format, timing, sequencing, and error checking.'),
          FC('What is a network topology?', 'The physical or logical arrangement of devices in a network (star, ring, bus, mesh, hybrid).'),
          FC('What is a hub?', 'A Layer 1 (physical) device that broadcasts incoming data to all ports; creates a shared medium and half-duplex communication.'),
          FC('What is a gateway?', 'A device or software that connects networks using different protocols; enables communication between incompatible systems.'),
          FC('What does network redundancy do?', 'Provides alternative paths for data; if one connection fails, traffic can reroute through alternate paths.')
        ], questions: [
          MC('Which network type spans the largest geographic area?', ['LAN', 'MAN', 'WAN', 'PAN'], 2),
          TF('A switch operates at Layer 3 of the OSI model.', false),
          IDQ('What is the term for a device that connects multiple networks and selects the best path for data packets?', 'Router'),
          MC('Which device is primarily used to connect wireless devices to a wired network?', ['Switch', 'Router', 'Hub', 'Wireless Access Point'], 3),
          FB('A ___ is a Layer 2 device that builds a MAC address table to forward frames.', 'Switch'),
          MC('MAN covers approximately?', ['One building', 'One city', 'One region', 'Multiple countries'], 1),
          TF('Throughput and bandwidth are always equal.', false),
          IDQ('Physical/logical arrangement of devices in network called?', 'Topology'),
          MC('Hub operates at which OSI layer?', ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4'], 0),
          FB('____ is the time delay between sending and receiving data.', 'Latency'),
          MC('Gateway primarily enables?', ['Same protocol networks', 'Different protocol networks', 'Faster speeds', 'Local connectivity'], 1),
          TF('Network redundancy prevents all connection failures.', false)
        ]
      },
      {
        id: 'm2', title: 'OSI and TCP/IP Models', flashcards: [
          FC('What are the 7 OSI layers (bottom to top)?', 'Physical, Data Link, Network, Transport, Session, Presentation, Application.'),
          FC('Which OSI layer handles end-to-end error recovery?', 'Transport Layer (Layer 4) \u2014 provides reliable delivery via TCP or unreliable via UDP.'),
          FC('Which OSI layer handles logical addressing (IP)?', 'Network Layer (Layer 3) \u2014 responsible for routing and IP addressing.'),
          FC('How many layers does the TCP/IP model have?', '4 layers: Network Access, Internet, Transport, Application.'),
          FC('What is encapsulation?', 'The process of adding protocol headers and trailers to data as it moves down the protocol stack at each layer.'),
          FC('Physical Layer (OSI Layer 1)?', 'Responsible for transmitting raw bits over physical media; deals with cables, voltages, and signaling.'),
          FC('Data Link Layer (OSI Layer 2)?', 'Handles framing, MAC addressing, switching, and error detection; operates on frames and uses MAC addresses.'),
          FC('Session Layer (OSI Layer 5)?', 'Manages dialogue control between hosts, establishes/maintains/terminates connections between applications.'),
          FC('Presentation Layer (OSI Layer 6)?', 'Handles data formatting, encryption, compression, and translation between different character sets.'),
          FC('What is the PDU at Layer 3?', 'Packet \u2014 a unit of data that includes the source and destination IP addresses from the Network Layer.'),
          FC('What is the PDU at Layer 2?', 'Frame \u2014 a unit of data that includes source and destination MAC addresses from the Data Link Layer.'),
          FC('What is the PDU at Layer 4?', 'Segment (TCP) or Datagram (UDP) \u2014 transport layer PDU containing source and destination port numbers.'),
          FC('Difference between TCP/IP and OSI models?', 'TCP/IP has 4 layers (less detailed); OSI has 7 layers (more granular); both describe network communication.'),
          FC('What happens during decapsulation?', 'Process of removing headers as data moves up the protocol stack; opposite of encapsulation.')
        ], questions: [
          MC('Which OSI layer is responsible for framing?', ['Network', 'Data Link', 'Transport', 'Physical'], 1),
          TF('The TCP/IP model has more layers than the OSI model.', false),
          IDQ('What is the process called where data is wrapped with protocol headers at each layer as it travels down the stack?', 'Encapsulation'),
          MC('At which layer does a router primarily operate?', ['Data Link', 'Transport', 'Network', 'Application'], 2),
          FB('The ___ layer of the OSI model handles formatting, encrypting, and compressing data.', 'Presentation'),
          MC('Which layer is responsible for physical transmission of bits?', ['Physical', 'Data Link', 'Network', 'Transport'], 0),
          TF('A switch operates at the Network Layer (Layer 3).', false),
          IDQ('PDU at the Transport Layer is called a ___?', 'Segment'),
          MC('What does decapsulation refer to?', ['Adding headers to data', 'Removing headers from data', 'Shuffling data', 'Encrypting data'], 1),
          FB('The ___ model is more practical and widely used than the OSI model in real networks.', 'TCP/IP'),
          MC('Routers operate at which layer to make forwarding decisions?', ['Layer 2', 'Layer 3', 'Layer 4', 'Layer 7'], 1),
          TF('Session management is a primary function of the Physical Layer.', false)
        ]
      },
      {
        id: 'm3', title: 'Physical and Data Link Layers', flashcards: [
          FC('What is a MAC address?', 'A 48-bit (6-byte) physical address assigned to a network interface, represented in hexadecimal (e.g., AA:BB:CC:DD:EE:FF).'),
          FC('What cable type is most common for Ethernet?', 'Unshielded Twisted Pair (UTP) \u2014 specifically Cat5e, Cat6, or Cat6a cables.'),
          FC('Max segment length for UTP at 1 Gbps?', '100 meters (328 feet) \u2014 the IEEE standard maximum for horizontal cable runs.'),
          FC('What is CSMA/CD?', 'Carrier Sense Multiple Access with Collision Detection \u2014 the media access method in half-duplex Ethernet to handle frame collisions.'),
          FC('What is the FCS field in an Ethernet frame?', 'Frame Check Sequence \u2014 a 4-byte CRC value used to detect errors in the received frame.'),
          FC('What is STP cable?', 'Shielded Twisted Pair \u2014 UTP wrapped in foil/braid shielding to protect against electromagnetic interference (EMI).'),
          FC('Fiber Optic advantages?', 'Immune to EMI, supports long distances (10+ km), high bandwidth, secure, but expensive and requires specialized equipment.'),
          FC('What is a collision domain?', 'A network segment where data collisions can occur; shared media like hubs create one collision domain.'),
          FC('What is a broadcast domain?', 'A group of network devices that receive each other\'s broadcast frames; typically a VLAN or segment.'),
          FC('Ethernet frame fields?', 'Preamble, SFD, Destination MAC, Source MAC, Type/Length, Data, FCS.'),
          FC('Half-duplex vs Full-duplex?', 'Half-duplex: alternating send/receive, prone to collisions; Full-duplex: simultaneous send/receive, no collisions (no CSMA/CD needed).'),
          FC('What is a straight-through cable?', 'Ethernet cable where pin order is identical on both ends (T568A); used for connecting to switches/routers.'),
          FC('What is a crossover cable?', 'Ethernet cable where pin order is reversed between ends (T568A on one end, T568B on other); used for direct PC-to-PC connections.'),
          FC('What is the role of the preamble in Ethernet frames?', 'A 7-byte field used for synchronization and clock recovery to help receiving device align with incoming data.')
        ], questions: [
          MC('Which cable type is immune to electromagnetic interference?', ['UTP', 'STP', 'Coaxial', 'Fiber Optic'], 3),
          TF('Full-duplex Ethernet allows data to be sent and received simultaneously.', true),
          IDQ('What is the name of the Ethernet frame field used for error detection?', 'FCS'),
          MC('What is the correct format of a MAC address?', ['192.168.1.1', 'AA:BB:CC:DD:EE:FF', 'http://example.com', '00-1'], 1),
          FB('In Ethernet, ___ is the process where a device listens to the medium before transmitting.', 'Carrier Sense'),
          MC('How many bytes is a MAC address?', ['4', '6', '8', '12'], 1),
          TF('Fiber optic cables can be damaged by EMI.', false),
          IDQ('Technology used in half-duplex Ethernet for detecting collisions?', 'CSMA/CD'),
          MC('Max length for fiber optic segments?', ['100m', '500m', '1000m+', '50m'], 2),
          FB('A ___ cable is used to connect two PCs directly without a switch.', 'Crossover'),
          MC('Which device extends collision domains?', ['Switch', 'Router', 'Hub', 'Bridge'], 2),
          TF('In full-duplex mode, CSMA/CD is needed.', false),
          MC('Ethernet frame size range (data portion)?', ['46-1500 bytes', '64-1518 bytes', '0-512 bytes', '1500+ bytes'], 0),
          IDQ('Network device that separates broadcast domains?', 'Router')
        ]
      },
      {
        id: 'm4', title: 'Network Layer and IP Addressing', flashcards: [
          FC('IPv4 vs IPv6 address length?', 'IPv4 is 32 bits (4 bytes), IPv6 is 128 bits (16 bytes). IPv6 provides vastly more address space.'),
          FC('Default subnet mask for Class C?', '255.255.255.0, which is /24 in CIDR notation, providing 254 usable host addresses.'),
          FC('What is NAT and why is it used?', 'Network Address Translation \u2014 translates private IPs to public ones, conserving limited IPv4 address space.'),
          FC('What is the IPv4 loopback address?', '127.0.0.1 \u2014 used to test if the TCP/IP stack is properly configured on the local device.'),
          FC('Three private IPv4 address ranges?', '10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 \u2014 not routable on the public internet.'),
          FC('What is a subnet mask?', 'A 32-bit number that divides an IP address into network and host portions; determines network size.'),
          FC('CIDR notation example?', '/24 means first 24 bits are network, last 8 bits are host; equivalent to 255.255.255.0.'),
          FC('IPv4 Class A range?', '1.0.0.0 to 126.255.255.255; first bit is 0; supports 16 million hosts per network.'),
          FC('IPv4 Class B range?', '128.0.0.0 to 191.255.255.255; first two bits are 10; supports 65,000 hosts per network.'),
          FC('IPv4 Class D and E?', 'Class D: 224-239 (multicast); Class E: 240-255 (experimental/reserved).'),
          FC('What is the default gateway?', 'The IP address of the router interface on the same network; used to reach networks outside the local subnet.'),
          FC('What is a broadcast address?', 'Last address in a subnet where all host bits are 1; sends packets to all devices in that network.'),
          FC('Network address definition?', 'First address in a subnet where all host bits are 0; identifies the entire network segment.'),
          FC('What is ARP and why is it used?', 'Address Resolution Protocol \u2014 maps IP addresses to MAC addresses; essential for local network communication.'),
          FC('Binary to decimal: 11111111?', '255 \u2014 all bits set to 1 equals 128+64+32+16+8+4+2+1 = 255.'),
          FC('Binary to decimal: 10101010?', '170 \u2014 calculation: 128+32+8+2 = 170 (every other bit).'),
          FC('Decimal 192 to binary?', '11000000 \u2014 192 = 128+64 = two leftmost bits set to 1.'),
          FC('Subnetting with /25?', '2 subnets, 126 usable hosts each; splits Class C into two equal networks; mask 255.255.255.128.'),
          FC('Subnetting with /26?', '4 subnets, 62 usable hosts each; divides Class C into four equal networks; mask 255.255.255.192.'),
          FC('Subnetting with /27?', '8 subnets, 30 usable hosts each; mask 255.255.255.224; used for smaller networks.'),
          FC('Formula for host count?', '2^(32 - CIDR) - 2; subtract 2 for network and broadcast addresses (when CIDR < 31).'),
          FC('Formula for subnet count?', '2^(32 - original CIDR - new CIDR) gives number of subnets when subnetting a network.'),
          FC('Network address calculation?', 'Bitwise AND the IP address with subnet mask; result is the network address of that subnet.'),
          FC('Broadcast address calculation?', 'Set all host bits to 1; equals network address + (number of addresses in subnet - 1).')
        ], questions: [
          MC('Which IPv4 class supports the most hosts per network?', ['Class C', 'Class B', 'Class A', 'Class D'], 2),
          TF('IPv6 uses hexadecimal notation separated by colons.', true),
          IDQ('What IPv4 address tests the local TCP/IP stack?', '127.0.0.1'),
          MC('CIDR notation for subnet mask 255.255.255.192?', ['/24', '/26', '/28', '/30'], 1),
          FB('The IPv4 address ___ serves as the default gateway when no specific route matches.', '0.0.0.0'),
          MC('How many bits in IPv4 address?', ['16', '32', '64', '128'], 1),
          TF('Private IP ranges are routable on the internet.', false),
          IDQ('Protocol used to map IP addresses to MAC addresses?', 'ARP'),
          MC('Subnet mask 255.255.0.0 equals?', ['/16', '/24', '/30', '/25'], 0),
          FB('The ___ contains all available host addresses for a network.', 'Subnet'),
          MC('First octet range for Class B?', ['1-126', '128-191', '192-223', '224-239'], 1),
          TF('Default gateway must be on the same subnet as the host.', true),
          MC('Number of usable hosts in /30 subnet?', ['2', '6', '14', '30'], 0),
          IDQ('Last address in a subnet with all host bits set to 1?', 'Broadcast address'),
          MC('Network address for 192.168.1.130/25?', ['192.168.1.0', '192.168.1.128', '192.168.1.64', '192.168.1.255'], 1),
          IDQ('Broadcast address for 10.0.0.0/28?', '10.0.0.15'),
          MC('How many usable hosts in 172.16.0.0/22?', ['254', '510', '1022', '2046'], 2),
          FB('The binary equivalent of 255.255.255.0 has ___ ones and 8 zeros.', '24'),
          MC('192.168.1.193 with /26 mask belongs to which subnet?', ['192.168.1.192', '192.168.1.128', '192.168.1.64', '192.168.1.0'], 0),
          TF('The /31 subnet provides 30 usable host addresses.', false),
          MC('Subnet mask 255.255.255.240 equals CIDR?', ['/28', '/26', '/24', '/30'], 0),
          IDQ('First usable host in 10.20.30.0/25?', '10.20.30.1'),
          MC('Network 172.16.0.0/23 contains how many total addresses?', ['256', '512', '1024', '2048'], 1),
          FB('Subnetting divides a larger network into smaller ___ for better organization.', 'subnets'),
          MC('Binary 10001100.10101000.00000001.00000001 in decimal?', ['140.168.1.1', '128.160.1.1', '144.170.1.1', '132.166.1.1'], 0),
          TF('CIDR /32 represents a single host address.', true)
        ]
      },
      {
        id: 'm5', title: 'Transport and Application Layers', flashcards: [
          FC('TCP vs UDP main difference?', 'TCP is connection-oriented with reliability (ACKs, retransmission); UDP is connectionless, no reliability but lower overhead and faster.'),
          FC('Well-known port for HTTP?', 'Port 80 \u2014 the default for unencrypted web traffic.'),
          FC('What is DNS?', 'Domain Name System \u2014 translates human-readable domain names (e.g., www.cisco.com) into IP addresses.'),
          FC('What is DHCP?', 'Dynamic Host Configuration Protocol \u2014 automatically assigns IP addresses, subnet masks, default gateways, and DNS servers.'),
          FC('What is the TCP three-way handshake?', 'SYN then SYN-ACK then ACK \u2014 a three-step process to establish a reliable connection before data transfer.'),
          FC('TCP port range?', '0-65535; ports 0-1023 are well-known (reserved), 1024-49151 are registered, 49152-65535 are dynamic/private.'),
          FC('What is HTTPS?', 'HyperText Transfer Protocol Secure \u2014 HTTP with SSL/TLS encryption; uses port 443 for secure web communication.'),
          FC('FTP ports?', 'Control: port 21; Data: port 20 (active mode); used for file transfer between client and server.'),
          FC('SMTP, POP3, IMAP ports?', 'SMTP (email send): port 25; POP3 (email retrieve): port 110; IMAP (email retrieve, keep on server): port 143.'),
          FC('Telnet vs SSH?', 'Telnet (port 23): unencrypted remote terminal access (insecure); SSH (port 22): encrypted secure shell access.'),
          FC('What is a socket?', 'Combination of IP address + port number + protocol; uniquely identifies an endpoint in network communication.'),
          FC('TCP flow control?', 'Window size indicates how much data receiver can accept; prevents sender from overwhelming receiver with data.'),
          FC('What is congestion control?', 'TCP mechanism to reduce data transmission rate when network congestion detected; prevents packet loss.'),
          FC('UDP advantages?', 'Lower latency, less overhead, no connection setup; ideal for real-time apps like VoIP, video streaming, online gaming.')
        ], questions: [
          MC('Best protocol for video streaming (speed over reliability)?', ['TCP', 'UDP', 'FTP', 'HTTP'], 1),
          TF('DNS primarily uses TCP port 53 for standard queries.', false),
          IDQ('What is the TCP connection process involving SYN, SYN-ACK, and ACK called?', 'Three-way handshake'),
          MC('What port does HTTPS use?', ['80', '8080', '443', '21'], 2),
          FB('____ is a connection-oriented transport protocol providing flow control, error recovery, and reliable delivery.', 'TCP'),
          MC('Well-known port range?', ['0-100', '0-1023', '1024-2048', '32768-65535'], 1),
          TF('UDP guarantees delivery of all packets in order.', false),
          IDQ('Port number for secure SSH access?', '22'),
          MC('DHCP provides?', ['DNS only', 'IP config only', 'IP, gateway, DNS, subnet mask', 'Firewall rules'], 2),
          FB('____ combines IP address with port number uniquely identifying network endpoint.', 'Socket'),
          MC('FTP data transfer port?', ['20', '21', '25', '110'], 0),
          TF('Telnet provides encrypted terminal access.', false)
        ]
      }
    ]
  },
  {
    id: 'ccna2', title: 'CCNA 2: Switching, Routing and Wireless Essentials',
    desc: 'VLANs, STP, routing concepts, static/dynamic routing (OSPF), and wireless fundamentals.',
    color: '#ffd166',
    modules: [
      {
        id: 'm1', title: 'Switching Concepts and VLANs', flashcards: [
          FC('What is a VLAN?', 'Virtual Local Area Network \u2014 logically segments a physical network into separate broadcast domains at Layer 2.'),
          FC('Default VLAN on Cisco switches?', 'VLAN 1 \u2014 all ports belong to it by default, and it is the native VLAN on trunk links.'),
          FC('What is trunking?', 'Carrying traffic for multiple VLANs over a single link using 802.1Q frame tagging.'),
          FC('What is the native VLAN on a trunk?', 'The VLAN whose traffic is sent untagged across the trunk link. Default is VLAN 1.'),
          FC('What is a broadcast domain?', 'A network segment where any device can broadcast to all others \u2014 each VLAN is its own broadcast domain.'),
          FC('VLAN range on Cisco switches?', 'VLANs 0-1005 (standard range) and 1006-4094 (extended range); only standard range saved in NVRAM.'),
          FC('Access port in VLAN?', 'Port configured to belong to a single VLAN; connects to end devices like PCs or printers.'),
          FC('Trunk port in VLAN?', 'Port configured to carry traffic for multiple VLANs; used between switches or between switch and router.'),
          FC('VLAN tagging 802.1Q?', 'Adds 4-byte tag to Ethernet frame containing VLAN ID (12 bits) allowing switches to identify frame VLAN.'),
          FC('Inter-VLAN communication requirement?', 'Devices must be connected through a Layer 3 device (router or multilayer switch) to communicate across VLANs.'),
          FC('VLAN benefits?', 'Network segmentation, improved security, reduced broadcast traffic, flexible network design, easier management.'),
          FC('VLAN trunk allowed list?', 'Specifies which VLANs can traverse the trunk; improves security by restricting VLAN traffic.')
        ], questions: [
          MC('Protocol used to tag frames with VLAN info?', ['802.11', '802.1Q', '802.3', '802.1X'], 1),
          TF('Devices in different VLANs can communicate without a router.', false),
          IDQ('IEEE standard for VLAN tagging on trunk links?', '802.1Q'),
          MC('How many VLANs can 802.1Q support?', ['100', '256', '1024', '4094'], 3),
          FB('The default VLAN on most Cisco switches is VLAN ___.', '1'),
          MC('Standard VLAN range limit?', ['100-500', '1-1005', '1-4094', 'No limit'], 1),
          TF('Access ports can carry multiple VLANs.', false),
          IDQ('Port type carrying multiple VLAN traffic?', 'Trunk'),
          MC('VLAN 0 and 4095 are?', ['Usable', 'Reserved', 'Extended', 'Standard'], 1),
          FB('Inter-VLAN traffic requires ____ connectivity.', 'Layer 3')
        ]
      },
      {
        id: 'm2', title: 'Spanning Tree Protocol', flashcards: [
          FC('Purpose of STP?', 'Prevent Layer 2 loops in networks with redundant paths by placing certain ports in a blocking state.'),
          FC('How is the root bridge elected?', 'The switch with the lowest Bridge ID (priority + MAC address) becomes the root bridge.'),
          FC('Five STP port states?', 'Blocking, Listening, Learning, Forwarding, Disabled.'),
          FC('What are BPDUs?', 'Bridge Protocol Data Units \u2014 frames exchanged between switches to build and maintain the spanning tree topology.'),
          FC('What is Rapid PVST+?', 'Rapid Per-VLAN Spanning Tree Plus \u2014 Cisco RSTP implementation running a separate instance per VLAN for faster convergence.'),
          FC('STP port roles?', 'Root Port (closest to root), Designated Port (forwards on segment), Blocking Port (discards data), Non-Designated (backup).'),
          FC('What is path cost in STP?', 'Value assigned to each link; lower cost indicates better path to root; calculated based on port speed.'),
          FC('Default STP port cost for 1 Gbps?', '4; for 10 Gbps it\'s 2; costs guide port selection in spanning tree calculation.'),
          FC('Bridge Priority value range?', '0-61440 in increments of 4096; lower value wins; 32768 is default.'),
          FC('How often are BPDUs sent by default?', 'Every 2 seconds; allows network to adapt quickly to topology changes.'),
          FC('STP convergence definition?', 'Time for all switches to rebuild spanning tree after network topology change; RSTP converges faster than STP.'),
          FC('Blocking port purpose?', 'Receives BPDUs but does not forward data; prevents loops by blocking redundant paths.'),
          FC('Learning state duration?', 'Default 15 seconds; port listens to frames to learn MAC addresses but doesn\'t forward yet.'),
          FC('What is PortFast?', 'Cisco feature that immediately transitions port to Forwarding state; used on access ports to end devices.')
        ], questions: [
          MC('Which STP port state forwards user data?', ['Blocking', 'Listening', 'Learning', 'Forwarding'], 3),
          TF('STP picks the port with the highest path cost as the root port.', false),
          IDQ('What frames do switches exchange to build the spanning tree?', 'BPDUs'),
          MC('Default STP priority on a Cisco switch?', ['0', '1', '32768', '4096'], 2),
          FB('In STP, the port with the lowest ___ to the root bridge becomes the root port.', 'Path cost'),
          MC('What port state does STP use before forwarding data?', ['Blocking', 'Listening and Learning', 'Disabled', 'Forwarding'], 1),
          TF('Root bridge election considers MAC address only.', false),
          IDQ('STP feature that skips learning phase on access ports?', 'PortFast'),
          MC('How long is the learning state by default?', ['5 seconds', '10 seconds', '15 seconds', '20 seconds'], 2),
          FB('RSTP improves convergence time by enabling faster ___ transitions.', 'port'),
          MC('Bridge ID consists of?', ['Priority only', 'MAC only', 'Priority + MAC Address', 'Port number + VLAN'], 2),
          TF('All ports on the root bridge are designated ports.', true),
          MC('Default hello time for BPDU transmission?', ['1 second', '2 seconds', '5 seconds', '10 seconds'], 1),
          IDQ('Per-VLAN spanning tree instance in Cisco networks?', 'PVST')
        ]
      },
      {
        id: 'm3', title: 'Routing Concepts', flashcards: [
          FC('What is a routing table?', 'A database in a router with network destinations, next-hop addresses, and interface info for forwarding packets.'),
          FC('Three types of routes?', 'Connected (directly attached), Static (manually configured), Dynamic (learned via routing protocols).'),
          FC('What is a default route?', 'Used when no other route matches \u2014 0.0.0.0/0, also called the gateway of last resort.'),
          FC('Administrative distance of a connected route?', '0 \u2014 the lowest possible, meaning it is always preferred over other route sources.'),
          FC('What is a next-hop address?', 'The IP address of the next router in the path toward the destination network.'),
          FC('What is Administrative Distance (AD)?', 'A number from 0-255 indicating route trustworthiness; lower values are preferred over higher values.'),
          FC('Static route administrative distance?', '1 (or configurable) \u2014 second most trusted after connected routes; manually defined by administrator.'),
          FC('OSPF administrative distance?', '110 \u2014 used for Open Shortest Path First dynamic routing protocol.'),
          FC('RIP administrative distance?', '120 \u2014 used for Routing Information Protocol; least trusted common IGP.'),
          FC('EIGRP administrative distance?', '90 (internal), 170 (external) \u2014 used for Enhanced Interior Gateway Routing Protocol.'),
          FC('How does router make forwarding decisions?', 'Looks for longest prefix match in routing table; forwards to next-hop for best matching route.'),
          FC('What is a routing protocol?', 'Software process that enables routers to dynamically learn and share network topology information.'),
          FC('Distance-vector vs Link-state?', 'Distance-vector (RIP): sends routing table periodically; Link-state (OSPF): sends link information and builds topology map.'),
          FC('What is metric in routing?', 'A value used by routing protocols to determine path quality; varies by protocol (hop count, bandwidth, cost).')
        ], questions: [
          MC('Which route type has the lowest administrative distance?', ['Static', 'OSPF', 'Connected', 'RIP'], 2),
          TF('A routing table can contain multiple routes to the same destination.', true),
          IDQ('Administrative distance value for a static route?', '1'),
          MC('What does "C" mean in a Cisco routing table?', ['Static', 'Connected', 'OSPF', 'Default'], 1),
          MC('Best matching route in routing table is?', ['First match', 'Longest prefix match', 'Shortest path', 'Lowest cost'], 1),
          TF('Higher administrative distance values are trusted more.', false),
          IDQ('Distance-vector routing algorithm also called?', 'Bellman-Ford'),
          MC('Default route notation?', ['192.168.0.0', '255.255.255.255', '0.0.0.0/0', '10.0.0.0'], 2),
          FB('A router uses ___ to decide which outgoing interface to send a packet.', 'Routing table'),
          MC('EIGRP is developed by?', ['IETF', 'Cisco', 'ISO', 'IEEE'], 1),
          TF('Link-state routing protocols send entire routing tables periodically.', false),
          MC('Metric used by RIP for routing decisions?', ['Bandwidth', 'Delay', 'Hop count', 'Reliability'], 2),
          IDQ('Type of routing where router forwards based on destination IP only?', 'Classless routing')
        ]
      },
      {
        id: 'm4', title: 'Static and Dynamic Routing', flashcards: [
          FC('What is a static route?', 'A manually configured route specifying a destination network and either a next-hop IP or exit interface.'),
          FC('What is OSPF?', 'Open Shortest Path First \u2014 a link-state routing protocol using the Dijkstra SPF algorithm to build a shortest-path tree.'),
          FC('What is an OSPF area?', 'A logical grouping of OSPF routers sharing the same link-state database, reducing routing overhead and CPU usage.'),
          FC('Distance Vector vs Link-State?', 'Distance vector shares its routing table with neighbors; link-state shares LSAs to build a complete topology map.'),
          FC('What is the OSPF Router ID?', 'A 32-bit value (IP-formatted) that uniquely identifies an OSPF router within the routing domain.'),
          FC('OSPF cost calculation?', 'Cost = 100,000,000 / bandwidth (in bps); lower cost links are preferred; can be manually adjusted.'),
          FC('Default RIP timers?', 'Update: 30 seconds (send routing table), Invalid: 180 seconds, Holddown: 180 seconds, Flush: 240 seconds.'),
          FC('RIP limitations?', 'Max hop count 15, slow convergence, less efficient, higher overhead from periodic updates, not scalable.'),
          FC('Link State Advertisement (LSA)?', 'Packet sent by OSPF router containing information about its interfaces, connected networks, and link metrics.'),
          FC('OSPF Hello interval?', 'Default 10 seconds (1 second on point-to-point); routers send hello packets to discover neighbors.'),
          FC('OSPF Dead interval?', 'Default 40 seconds on broadcast networks; neighbor considered down if no hellos received in this time.'),
          FC('Static route advantages?', 'No CPU/memory overhead from routing protocol, predictable paths, good for small networks or fixed topologies.'),
          FC('Static route disadvantages?', 'Manual configuration required, doesn\'t adapt to topology changes, not scalable for large networks.'),
          FC('Default static route command?', 'ip route 0.0.0.0 0.0.0.0 [next-hop IP or exit interface]; also called the gateway of last resort.')
        ], questions: [
          MC('Which protocol uses the Dijkstra SPF algorithm?', ['RIP', 'OSPF', 'EIGRP', 'BGP'], 1),
          TF('Static routes automatically adapt to topology changes.', false),
          IDQ('What protocol type shares its entire routing table only with directly connected neighbors?', 'Distance vector'),
          MC('Default OSPF administrative distance?', ['90', '110', '120', '1'], 1),
          FB('OSPF organizes routers into logical groupings called ___ to reduce link-state database size.', 'Areas'),
          MC('OSPF hello interval on broadcast networks?', ['5 seconds', '10 seconds', '30 seconds', '60 seconds'], 1),
          TF('RIP v2 supports variable length subnet masks.', true),
          IDQ('Algorithm used by OSPF to calculate shortest path?', 'Dijkstra'),
          MC('Maximum hop count for RIP?', ['15', '16', '32', 'Unlimited'], 0),
          FB('OSPF builds a complete ___ of the network topology.', 'map'),
          MC('OSPF cost formula?', ['100/bps', '1000/bps', '100,000,000/bps', 'bps/100'], 2),
          TF('RIP is preferred over OSPF in large enterprise networks.', false),
          MC('Dead interval on OSPF point-to-point links?', ['10 sec', '20 sec', '40 sec', '60 sec'], 1),
          IDQ('OSPF network type supporting automatic neighbor discovery?', 'Broadcast')
        ]
      },
      {
        id: 'm5', title: 'Wireless Networks', flashcards: [
          FC('What does SSID stand for?', 'Service Set Identifier \u2014 the name of a wireless network visible when scanning for available networks.'),
          FC('BSS vs ESS?', 'BSS = one AP + clients. ESS = multiple APs with the same SSID connected via a distribution system.'),
          FC('Non-overlapping 2.4 GHz channels?', 'Channels 1, 6, and 11 \u2014 the only three that don\'t overlap in the 2.4 GHz band (US region).'),
          FC('What is WPA3?', 'Wi-Fi Protected Access 3 \u2014 latest security standard with SAE for stronger key exchange and forward secrecy.'),
          FC('What is MIMO?', 'Multiple Input Multiple Output \u2014 uses multiple antennas on both ends to increase throughput and link reliability.')
        ], questions: [
          MC('Which WiFi standard first introduced MIMO?', ['802.11a', '802.11b', '802.11g', '802.11n'], 3),
          TF('The 5 GHz band supports more non-overlapping channels than 2.4 GHz.', true),
          IDQ('Term for the unique MAC address of a wireless access point?', 'BSSID'),
          MC('Most secure wireless security protocol?', ['WEP', 'WPA', 'WPA2', 'WPA3'], 3),
          FB('The ___ is the name users see when searching for available wireless networks.', 'SSID')
        ]
      }
    ]
  },
  {
    id: 'ccna3', title: 'CCNA 3: Scaling Networks',
    desc: 'Inter-VLAN routing, advanced routing protocols (EIGRP, OSPF), ACLs, NAT, and network redundancy.',
    color: '#8338ec',
    modules: [
      {
        id: 'm1', title: 'Inter-VLAN Routing', flashcards: [
          FC('What is inter-VLAN routing?', 'Process of forwarding traffic between VLANs using a Layer 3 device (router or SVI).'),
          FC('Two methods for inter-VLAN routing?', 'Router-on-a-stick (using subinterfaces) and Switch Virtual Interfaces (SVIs) on Layer 3 switches.'),
          FC('What is a subinterface?', 'Virtual logical interface on a physical interface created to handle traffic for a specific VLAN on a router.'),
          FC('What is an SVI?', 'Switch Virtual Interface \u2014 virtual interface on a multilayer switch acting as the gateway for a VLAN.'),
          FC('Why not use separate physical interfaces for each VLAN?', 'Not scalable. Subinterfaces and SVIs allow multiple VLANs on a single physical link.'),
          FC('Router-on-a-stick configuration example?', 'interface g0/0.10; encapsulation dot1q 10; ip address 192.168.10.1 255.255.255.0'),
          FC('What is dot1q encapsulation?', '802.1Q protocol that tags frames with VLAN ID, used on subinterfaces for VLAN identification.'),
          FC('Native VLAN on subinterfaces?', 'VLAN whose traffic is sent untagged; usually matches trunk native VLAN but configured separately on each subinterface.'),
          FC('Multilayer switch advantage?', 'Much faster inter-VLAN routing performance since it uses specialized hardware instead of a router interface.'),
          FC('SVI configuration example?', 'interface vlan 10; ip address 192.168.10.1 255.255.255.0; no shutdown'),
          FC('Can routers route between themselves?', 'No, routers pass traffic through their interfaces; SVIs enable the switch itself to perform inter-VLAN routing.'),
          FC('Benefits of Layer 3 switches?', 'Faster performance, reduced hardware cost, single device for both switching and routing.'),
          FC('Trunk vs Access port?', 'Trunk carries multiple VLANs tagged; Access carries single VLAN untagged. Routers use trunk links for subinterfaces.'),
          FC('Why configure IP on SVI vs subinterface?', 'SVIs on multilayer switches are more efficient; subinterfaces on routers are for external routing into the switch.')
        ], questions: [
          MC('Which device can perform inter-VLAN routing without a router?', ['Switch', 'Hub', 'Multilayer switch', 'Repeater'], 2),
          TF('Router-on-a-stick requires separate physical interfaces per VLAN.', false),
          IDQ('What term describes a virtual interface on a router for VLAN routing?', 'Subinterface'),
          MC('On which OSI layer do routers/switches perform inter-VLAN routing?', ['Layer 2', 'Layer 3', 'Layer 4', 'Layer 5'], 1),
          FB('An SVI or ___ acts as the default gateway for a VLAN.', 'Virtual interface'),
          MC('What protocol tags VLAN info in frames?', ['802.11', '802.1Q', '802.3', '802.1X'], 1),
          TF('Each subinterface must have a unique IP address.', true),
          IDQ('Command to create subinterface on Cisco router?', 'interface'),
          MC('Best use case for router-on-a-stick?', ['Small branch', 'Large enterprise', 'Single VLAN', 'Core network'], 0),
          FB('The ____ encapsulation specifies VLAN ID on subinterface.', 'dot1q')
        ]
      },
      {
        id: 'm2', title: 'Static Routing Configuration', flashcards: [
          FC('Static route syntax on Cisco?', 'ip route destination-network subnet-mask {next-hop-ip | exit-interface}'),
          FC('What is administrative distance (AD)?', 'Value 0-255 indicating route reliability; lower AD has higher preference.'),
          FC('Default AD for static routes?', '1, second only to directly connected routes (AD 0).'),
          FC('Floating static route?', 'Backup route with higher AD than primary; activated only if primary fails.'),
          FC('Default static route?', 'ip route 0.0.0.0 0.0.0.0 next-hop-ip; gateway of last resort when no specific route matches.'),
          FC('Static route next-hop-ip vs exit-interface?', 'next-hop-ip requires neighbor IP (requires ARP resolution); exit-interface specifies outgoing port.'),
          FC('Common AD values?', 'Connected: 0, Static: 1, EIGRP: 90, OSPF: 110, RIP: 120, EIGRP external: 170'),
          FC('Static route advantages?', 'No bandwidth overhead, no CPU processing for protocol, good for stub networks and security.'),
          FC('Static route disadvantages?', 'Manual configuration, must update if topology changes, not scalable for large networks.'),
          FC('Summary static route?', 'Single route covering multiple subnets using larger CIDR block; reduces routing table size.'),
          FC('Verify static routes command?', 'show ip route; static routes marked with S and default route marked with S*.'),
          FC('Can static routes be redistributed?', 'Yes, via route redistribution in routing protocols to advertise static routes dynamically.'),
          FC('Static default route example?', 'ip route 0.0.0.0 0.0.0.0 192.168.1.1; sends all unknown traffic to that next-hop.'),
          FC('AD modification on static route?', 'ip route 10.0.0.0 255.0.0.0 192.168.1.1 50; changes default AD from 1 to 50.')
        ], questions: [
          MC('Default AD for directly connected routes?', ['0', '1', '15', '120'], 0),
          TF('Floating static route is a backup activated when primary fails.', true),
          IDQ('Parameter determining static route preference over dynamic?', 'Administrative distance'),
          MC('Which has higher priority, OSPF or static route?', ['OSPF', 'Static route', 'Depends on AD', 'Same'], 1),
          FB('____ command configures static route on Cisco.', 'ip route'),
          MC('Default AD for OSPF protocol?', ['1', '90', '110', '120'], 2),
          TF('Static routes auto-update when topology changes.', false),
          IDQ('Type of static route serving as backup?', 'Floating'),
          MC('Which specifies where packets exit router?', ['next-hop-ip', 'exit-interface', 'destination', 'metric'], 1),
          FB('Static AD 5 preferred over route with AD ___.', 'higher'),
          MC('Best use case for static routing?', ['Large enterprise', 'Stub networks', 'Core backbone', 'Dynamic topology'], 1),
          TF('Static routes can coexist with dynamic routing.', true)
        ]
      },
      {
        id: 'm3', title: 'EIGRP Concepts', flashcards: [
          FC('What is EIGRP?', 'Enhanced Interior Gateway Routing Protocol \u2014 advanced distance-vector (hybrid) using DUAL for fast convergence.'),
          FC('EIGRP metric components?', 'Bandwidth and delay (default); optionally hop count, load, and reliability.'),
          FC('What is DUAL?', 'Diffusing Update Algorithm \u2014 ensures loop-free routing with minimal convergence time.'),
          FC('EIGRP autonomous system (AS)?', 'Logical grouping; routers only exchange updates within same AS number.'),
          FC('Default EIGRP AD?', 'Internal: 90; External: 170.'),
          FC('EIGRP neighbor requirements?', 'Same AS, same K values, consistent metrics, interface connectivity, interface not passive.'),
          FC('Default hello interval?', '5 seconds on normal links, 60 seconds on low-bandwidth links; miss 3 hellos to mark down.'),
          FC('Feasible Distance (FD)?', 'Lowest metric from source to destination; used to select best path.'),
          FC('Advertised Distance (AD)?', 'Metric reported by neighbor; must be less than FD to be a feasible successor.'),
          FC('Feasible Successor?', 'Backup route meeting feasibility condition (AD less than FD); used if primary fails.'),
          FC('EIGRP split horizon?', 'Router does not advertise route back to interface it was learned from; prevents loops.'),
          FC('EIGRP K values?', 'Multipliers for metric components (default K1=1, K2=0, K3=1, K4=0, K5=0); must match among neighbors.'),
          FC('EIGRP wildcard mask vs subnet?', 'Wildcard mask inverts subnet mask bits; 0=must match, 1=dont care.'),
          FC('Passive interface in EIGRP?', 'Interface that participates in routing table but not in EIGRP adjacencies/updates.')
        ], questions: [
          MC('EIGRP hello interval default?', ['5', '10', '30', '60'], 0),
          TF('EIGRP sends full updates after initial exchange.', false),
          IDQ('Algorithm EIGRP uses for loop-free routing?', 'DUAL'),
          MC('EIGRP default metric based on?', ['Bandwidth & Delay', 'Hop count', 'Load', 'All'], 0),
          FB('EIGRP AS number must be same to form ____.', 'adjacency'),
          MC('Default EIGRP AD internal?', ['1', '90', '110', '170'], 1),
          TF('Feasible successor backup route always ready.', true),
          IDQ('Metric reported by neighbor in EIGRP?', 'Advertised Distance'),
          MC('When does feasible successor activate?', ['Primary down', 'Load exceeds', 'Any time', 'Never'], 0),
          FB('EIGRP uses ____ to prevent routing loops.', 'split horizon'),
          MC('EIGRP metric formula default K values?', ['K1=1,K2=0,K3=1,K4=0,K5=0', 'All ones', 'All zeros', 'Mixed'], 0),
          TF('Passive interfaces still receive route updates.', false)
        ]
      },
      {
        id: 'm4', title: 'OSPF Multi-Area Design', flashcards: [
          FC('Why use OSPF areas?', 'Reduces LSA flooding, CPU overhead, convergence time; creates scalable hierarchy.'),
          FC('Backbone area (Area 0)?', 'Core of OSPF domain; all other areas must connect through it.'),
          FC('Area Border Router (ABR)?', 'Router with interfaces in multiple areas; summarizes/filters LSAs.'),
          FC('Autonomous System Boundary (ASBR)?', 'Router connecting OSPF domain to external networks; injects external routes.'),
          FC('OSPF area types?', 'Backbone (0), Standard, Stub, Totally Stubby, Not-So-Stubby (NSSA).'),
          FC('Stub area?', 'Does not receive Type 5 external LSAs; ABR injects default route instead.'),
          FC('Totally Stubby area?', 'Most restrictive; no external or inter-area routes except default route from ABR.'),
          FC('NSSA area?', 'Like stub but allows ASBR within area; external routes converted to Type 7 LSAs.'),
          FC('LSA Type 1?', 'Router LSA; describes routes within area, flooded only within area.'),
          FC('LSA Type 2?', 'Network LSA; describes multi-access network, originated by Designated Router.'),
          FC('LSA Type 3?', 'Summary LSA; describes inter-area routes, originated by ABR, scope limited.'),
          FC('LSA Type 5?', 'External LSA; describes routes outside OSPF domain, flooded throughout domain.'),
          FC('LSA Type 7?', 'NSSA External LSA; originated in NSSA, converted to Type 5 at ABR.'),
          FC('Cost vs Metric?', 'OSPF uses cost (inverse of bandwidth); higher bandwidth = lower cost = preferred path.')
        ], questions: [
          MC('All OSPF areas connect to?', ['Area 1', 'Area 0', 'Area 255', 'Core'], 1),
          TF('Stub area routers receive external routes.', false),
          IDQ('Router with interfaces in multiple areas?', 'ABR'),
          MC('How does ABR handle LSAs?', ['Floods', 'Summarizes', 'Drops', 'Retransmits'], 1),
          FB('___ area does not receive external LSAs.', 'Stub'),
          MC('OSPF cost based on?', ['Hop count', 'Bandwidth', 'Delay', 'Admin'], 1),
          TF('All areas must connect to backbone.', true),
          IDQ('Router connecting to external networks?', 'ASBR'),
          MC('Totally Stubby allows?', ['Any routes', 'Default only', 'Summary only', 'All'], 1),
          FB('Type 5 LSA describes routes outside ____.', 'OSPF'),
          MC('NSSA area advantage?', ['Allows ASBR', 'Smaller DB', 'Faster', 'Simpler'], 0),
          TF('OSPF areas reduce routing table size.', true)
        ]
      },
      {
        id: 'm5', title: 'Access Control Lists (ACLs)', flashcards: [
          FC('What is ACL?', 'Access Control List \u2014 ordered permit/deny statements filtering traffic by IP, port, protocol.'),
          FC('Standard ACL (1-99)?', 'Filters by source IP only; less powerful but less CPU intensive.'),
          FC('Extended ACL (100-199)?', 'Filters by source, destination, protocol, port; more granular control.'),
          FC('Named ACL benefit?', 'More readable, allows editing specific lines, better documentation than numbered.'),
          FC('Implicit deny rule?', 'Default denies all traffic not explicitly permitted; last statement in any ACL.'),
          FC('Standard ACL placement?', 'Close to destination to minimize false denials of permitted traffic.'),
          FC('Extended ACL placement?', 'Close to source (upstream) to filter unwanted traffic early, save bandwidth.'),
          FC('ACL direction?', 'Inbound filters arriving packets; outbound filters departing packets.'),
          FC('Numbered vs Named ACL?', 'Numbered: 1-199; Named: ip access-list standard/extended name; named more flexible.'),
          FC('wildcard mask in ACL?', '0 bit = must match, 1 bit = dont care; inverse of subnet mask (255.255.255.0 = 0.0.0.255).'),
          FC('ACL example: permit 192.168.1.0 0.0.0.255?', 'Permits all 192.168.1.x addresses where x=0-255.'),
          FC('Log keyword in ACL?', 'Logs matching packets to syslog for troubleshooting and auditing.'),
          FC('ACE (Access Control Entry)?', 'Individual permit/deny line in ACL; processed in order until match found.'),
          FC('Reload ACL without disruption?', 'Apply ACL again; removes and reapplies, but numbered ACLs lose unmodified lines.')
        ], questions: [
          MC('Standard ACL filters by?', ['Source IP', 'Dest IP', 'Protocol', 'Port'], 0),
          TF('Removing one line from numbered ACL preserves others.', false),
          IDQ('Implicit rule at end of every ACL?', 'Deny'),
          MC('Where place standard ACL?', ['Source', 'Destination', 'Backbone', 'Anywhere'], 1),
          FB('____ ACL filters source, dest, protocol, port.', 'Extended'),
          MC('Range for extended ACL?', ['1-99', '100-199', '200-299', '1000+'], 1),
          TF('ACL outbound filters departing packets.', true),
          IDQ('Keyword for logging ACL matches?', 'Log'),
          MC('Wildcard 0.0.0.255 matches?', ['Nothing', '192.168.1.x', 'All', 'First octet'], 1),
          FB('Individual line in ACL called ____.', 'ACE'),
          MC('Process ACL statements?', ['Random order', 'Sequential', 'Best match', 'Optimized'], 1),
          TF('Multiple ACLs on same interface allowed.', false)
        ]
      },
      {
        id: 'm6', title: 'Network Address Translation (NAT)', flashcards: [
          FC('What is NAT?', 'Network Address Translation \u2014 translates private IPs to public; conserves IPv4, provides security.'),
          FC('Static NAT?', 'One-to-one mapping: private IP always maps to same public IP; used for servers.'),
          FC('Dynamic NAT?', 'Many-to-many: multiple private IPs map to pool of public IPs on demand.'),
          FC('PAT (Port Address Translation)?', 'Many private IPs share single public IP using different port numbers; most common.'),
          FC('Inside vs Outside?', 'Inside = private network; Outside = public internet.'),
          FC('Inside Local address?', 'Original source IP address; actual private IP of sending device.'),
          FC('Inside Global address?', 'Translated IP; public IP representing inside device on internet.'),
          FC('Outside Local address?', 'Private IP of outside device as seen from inside network.'),
          FC('Outside Global address?', 'Actual IP of outside device on internet.'),
          FC('Static NAT configuration?', 'ip nat inside source static 192.168.1.10 203.0.113.10; permanent one-to-one mapping.'),
          FC('Dynamic NAT configuration?', 'Define pool: ip nat pool POOL 203.0.113.1 203.0.113.10 netmask 255.255.255.0'),
          FC('PAT configuration?', 'ip nat inside source list ACL interface GigabitEthernet0/0 overload; overload enables PAT.'),
          FC('NAT table?', 'Maintains dynamic mapping of inside-to-outside address translations; entries age out.'),
          FC('NAT advantages?', 'Extends IPv4, enhances security by hiding internal IPs, simplifies network redesign.')
        ], questions: [
          MC('NAT allows private IPs to share public IP?', ['Static', 'Dynamic', 'PAT', 'None'], 2),
          TF('Static NAT needs one public IP per device.', true),
          IDQ('Method to distinguish connections sharing one public IP?', 'Port'),
          MC('Static NAT best for?', ['PCs', 'Servers', 'Printers', 'Mobile'], 1),
          FB('____ process shares one public IP using ports.', 'PAT'),
          MC('Inside Local address is?', ['Public IP', 'Private IP', 'Translated', 'Internet'], 1),
          TF('NAT required on internet.', false),
          IDQ('Keyword enabling PAT in Cisco?', 'Overload'),
          MC('NAT typically at?', ['Inside LAN', 'Border router', 'Core', 'Access'], 1),
          FB('Outside Global address is actual IP on ____.', 'Internet'),
          MC('NAT table entries?', ['Permanent', 'Dynamic/aging', 'Static only', 'Manual'], 1),
          TF('Dynamic NAT needs pool of public IPs.', true)
        ]
      },
      {
        id: 'm7', title: 'Network Redundancy and Reliability', flashcards: [
          FC('What is HSRP?', 'Hot Standby Routing Protocol \u2014 Cisco proprietary; one active, one standby gateway.'),
          FC('What is VRRP?', 'Virtual Router Redundancy Protocol \u2014 open standard; one master, multiple backups.'),
          FC('What is GLBP?', 'Gateway Load Balancing Protocol \u2014 Cisco proprietary; active-active load sharing.'),
          FC('Virtual IP in HSRP/VRRP?', 'Shared floating IP; clients use as default gateway.'),
          FC('HSRP failure detection?', 'Hello messages every 3 seconds; standby takes over if misses 3 hellos (10 sec default).'),
          FC('HSRP priority?', 'Default 100; higher priority becomes active; tie goes to higher IP.'),
          FC('HSRP group number?', 'Range 0-255 (extended 256-4095); identifies logical gateway group.'),
          FC('VRRP advertisement interval?', '1 second default; master sends advertisements to multicast 224.0.0.18.'),
          FC('GLBP members?', 'One Active Virtual Gateway (AVG) and multiple Active Virtual Forwarders (AVF).'),
          FC('GLBP load balancing?', 'Each client learns different MAC for VIP; traffic load-balanced among forwarders.'),
          FC('HSRP standby command?', 'standby group priority value; must be applied to all group members consistently.'),
          FC('Preemption in HSRP?', 'Standby becomes active only if it has higher priority and preemption enabled.'),
          FC('HSRP multicast address?', '224.0.0.2 UDP port 1985; hello messages sent to this multicast group.'),
          FC('Tracking in HSRP?', 'Monitor WAN interface; if down, decrease priority to allow standby takeover.')
        ], questions: [
          MC('Which protocol offers active-active load balancing?', ['HSRP', 'VRRP', 'GLBP', 'STP'], 2),
          TF('HSRP open standard across vendors.', false),
          IDQ('Shared IP address in gateway redundancy?', 'Virtual IP'),
          MC('Default HSRP hello interval?', ['1 sec', '3 sec', '5 sec', '10 sec'], 1),
          FB('____ router in HSRP actively forwards traffic.', 'Active'),
          MC('VRRP master selection based on?', ['Priority', 'IP', 'MAC', 'Interface'], 0),
          TF('Standby in HSRP becomes active automatically.', true),
          IDQ('HSRP parameter determining gateway leadership?', 'Priority'),
          MC('GLBP advantage?', ['Simple', 'Load balanced', 'Cheaper', 'Faster'], 1),
          FB('VRRP is ____ standard protocol.', 'open'),
          MC('Failure detection in HSRP by?', ['Ping', 'Hellos', 'ARP', 'BGP'], 1),
          TF('Preemption requires explicit HSRP config.', true)
        ]
      },
      {
        id: 'm8', title: 'Network Scaling and Best Practices', flashcards: [
          FC('Link aggregation purpose?', 'Combines multiple links into single logical link for bandwidth/redundancy.'),
          FC('What is EtherChannel?', 'Cisco technology bundling multiple Ethernet interfaces into virtual interface.'),
          FC('EtherChannel load balancing?', 'Source MAC, Dest MAC, Source IP, Dest IP, Source Port, Dest Port, or combinations.'),
          FC('Static vs dynamic EtherChannel?', 'Static: manual configuration; Dynamic: uses LACP or PAgP protocol for negotiation.'),
          FC('LACP protocol?', 'Link Aggregation Control Protocol \u2014 IEEE standard for dynamic link bundling.'),
          FC('PAgP protocol?', 'Port Aggregation Protocol \u2014 Cisco proprietary for dynamic link bundling.'),
          FC('EtherChannel load distribution?', 'Traffic from same flow uses single link; different flows use different links.'),
          FC('Static routes vs dynamic?', 'Static: simple networks, few routes; Dynamic: complex, changing topologies (OSPF/EIGRP).'),
          FC('Hierarchical network design?', 'Core (backbone), Distribution (aggregation), Access (user connectivity) layers.'),
          FC('Three-tier model advantages?', 'Scalability, redundancy, easy troubleshooting, performance optimization.'),
          FC('EtherChannel requirements?', 'Same speed, same duplex, same VLAN membership on all member ports.'),
          FC('Maximum members in EtherChannel?', 'Typically 8 physical interfaces bundled into 1 logical interface.'),
          FC('Load balancing methods priority?', 'Destination IP most common for routing; Source/Dest MAC for switching.'),
          FC('Network segmentation?', 'Dividing network into smaller subnets/VLANs for security, performance, management.')
        ], questions: [
          MC('Maximum ports in EtherChannel?', ['2', '4', '8', '16'], 2),
          TF('EtherChannel requires identical bandwidth.', true),
          IDQ('Technology bundling physical interfaces?', 'EtherChannel'),
          MC('Best load balancing method?', ['Round-robin', 'Src/Dest IP', 'Static', 'Random'], 1),
          FB('____ is logical link of bundled interfaces.', 'EtherChannel'),
          MC('LACP standard body?', ['Cisco', 'IEEE', 'IETF', 'Private'], 1),
          TF('PAgP is IEEE standard.', false),
          IDQ('Network design with core, distribution, access?', 'Hierarchical'),
          MC('When use static routes?', ['Large network', 'Stub network', 'Dynamic topology', 'Complex'], 1),
          FB('EtherChannel ____ distributes traffic across links.', 'load balancing'),
          MC('Network segmentation benefit?', ['Slower', 'Security', 'Larger', 'Simpler'], 1),
          TF('All EtherChannel ports must match speed.', true)
        ]
      }
    ]
  }
];

// ===== APPLICATION STATE =====
var courses = [];
var progress = {};
var S = {
  view: 'dashboard', cid: null, mid: null,
  fc: { idx: 0, flip: false, known: new Set(), cards: [] },
  qz: { idx: 0, ans: [], qs: [], done: false, sel: null, txt: '' },
  score: 0, correct: 0, total: 0
};

// ===== LOCAL STORAGE =====
function saveData() {
  try {
    localStorage.setItem('sf4c', JSON.stringify(courses));
    localStorage.setItem('sf4p', JSON.stringify(progress));
  } catch (e) { /* silent */ }
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isValidCourse(c) {
  return c && typeof c === 'object' && typeof c.title === 'string' && Array.isArray(c.modules);
}

function loadData() {
  courses = deepCopy(DEFAULTS);
  progress = {};
  try {
    var raw = localStorage.getItem('sf4c');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidCourse)) {
        courses = parsed;
      }
    }
  } catch (e) { /* keep defaults */ }
  try {
    var praw = localStorage.getItem('sf4p');
    if (praw) {
      var pp = JSON.parse(praw);
      if (pp && typeof pp === 'object') progress = pp;
    }
  } catch (e) { /* keep empty */ }
}

// ===== NAVIGATION =====
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

function nav(view, params) {
  if (!params) params = {};
  S.view = view;

  var nextCid = params.cid !== undefined ? params.cid : S.cid;
  var nextMid = params.mid !== undefined ? params.mid : S.mid;

  if ((view === 'quiz' || view === 'quiz-results' || view === 'flashcards' || view === 'module') && nextCid === undefined) nextCid = S.cid;
  if ((view === 'quiz' || view === 'quiz-results' || view === 'flashcards' || view === 'module') && nextMid === undefined) nextMid = S.mid;

  S.cid = nextCid !== undefined && nextCid !== null ? nextCid : null;
  S.mid = nextMid !== undefined && nextMid !== null ? nextMid : null;
  S.score = params.score !== undefined ? params.score : S.score;
  S.correct = params.correct !== undefined ? params.correct : S.correct;
  S.total = params.total !== undefined ? params.total : S.total;
  if (view !== 'flashcards') S.fc = { idx: 0, flip: false, known: new Set(), cards: [] };
  if (view !== 'quiz' && view !== 'quiz-results') S.qz = { idx: 0, ans: [], qs: [], done: false, sel: null, txt: '' };
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('nav-dash').className = 'nav-btn' + (view === 'dashboard' ? ' active' : '');
  document.getElementById('nav-add').className = 'nav-btn' + (view === 'add-course' ? ' active' : '');
  window.scrollTo(0, 0);
  try { render(); }
  catch (e) {
    document.getElementById('app').innerHTML =
      '<div class="card" style="padding:32px"><p style="color:var(--error)">Render error: ' + e.message + '</p>' +
      '<button class="btn btn-secondary mt-4" onclick="doReset()">Reset Data</button></div>';
  }
}

// ===== TOAST NOTIFICATIONS =====
function toast(msg, type) {
  if (!type) type = 'success';
  var el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(function () { el.classList.add('visible'); }, 10);
  setTimeout(function () {
    el.classList.remove('visible');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }, 2800);
}

// ===== MODAL =====
function showModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('visible');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
}

// ===== UTILITY HELPERS =====
function getCourse(id) {
  for (var i = 0; i < courses.length; i++) if (courses[i].id === id) return courses[i];
  return null;
}

function getModule(course, id) {
  if (!course || !course.modules) return null;
  for (var i = 0; i < course.modules.length; i++) if (course.modules[i].id === id) return course.modules[i];
  return null;
}

function getProgress(cid, mid) { return progress[cid + '_' + mid] || {}; }

function setProgress(cid, mid, data) {
  var key = cid + '_' + mid;
  progress[key] = progress[key] || {};
  for (var x in data) progress[key][x] = data[x];
  saveData();
}

function genId() { return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5); }

function shuffle(arr) {
  var b = arr.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}

function escapeHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function typeLabel(t) {
  return { 'multiple-choice': 'Multiple Choice', 'identification': 'Identification', 'true-false': 'True or False', 'fill-blank': 'Fill in the Blank' }[t] || t;
}

function typeColor(t) {
  return { 'multiple-choice': '#06d6a0', 'identification': '#ffd166', 'true-false': '#118ab2', 'fill-blank': '#8338ec' }[t] || '#8892a4';
}

function checkAnswer(q, a) {
  if (a === null || a === undefined) return false;
  if (q.type === 'multiple-choice') return a === q.answer;
  if (q.type === 'true-false') return a === q.answer;
  return String(a).toLowerCase().trim() === String(q.answer).toLowerCase().trim();
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function findRelatedLesson(question, module) {
  if (!module || !module.flashcards || !module.flashcards.length) {
    return 'This question is testing a core networking rule: identify the actual behavior, protocol, or layer involved rather than just matching a phrase.';
  }

  var target = normalizeText(question.question + ' ' + (question.options ? question.options.join(' ') : '') + ' ' + (question.answer !== undefined ? String(question.answer) : ''));
  var tokens = target.split(/\s+/).filter(function (t) { return t.length > 3; });
  if (!tokens.length) {
    return 'This question is testing the actual networking rule behind the statement, not just the wording of the answer choice.';
  }

  var bestCard = null;
  var bestScore = 0;
  for (var i = 0; i < module.flashcards.length; i++) {
    var card = module.flashcards[i];
    var text = normalizeText(card.front + ' ' + card.back);
    var score = 0;
    for (var j = 0; j < tokens.length; j++) {
      if (text.indexOf(tokens[j]) !== -1) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCard = card;
    }
  }

  if (bestCard) {
    return 'The key idea is this: ' + bestCard.back + ' That is the networking concept the question is testing.';
  }

  return 'This question is testing a real networking rule: the protocol, address type, layer, or behavior described has to match how the network actually operates.';
}

function buildFallbackExplanation(question, module, isCorrect) {
  var lesson = findRelatedLesson(question, module);
  if (isCorrect) {
    return 'You chose the correct answer because it matches the actual networking rule. ' + lesson;
  }
  return 'This choice misses the underlying networking rule. ' + lesson;
}

function buildQuestionExplanation(question, module, userAnswer, isCorrect) {
  if (question && question.explanation) return question.explanation;

  var qText = (question ? question.question || '' : '').toLowerCase();
  var correctText = (question && question.options && question.answer !== undefined) ? question.options[question.answer] : '';
  var explanation = '';

  // ===== TRUE/FALSE =====
  if (question && question.type === 'true-false') {
    if (qText.indexOf('private') !== -1 && qText.indexOf('routable') !== -1) {
      return 'False. Private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are reserved for internal use and ISP routers reject them. They cannot reach the public internet directly; you need NAT to translate them to public IPs.';
    }
    if (qText.indexOf('switch') !== -1 && qText.indexOf('layer 3') !== -1) {
      return 'False. A switch operates at Layer 2 using MAC addresses for local forwarding. Layer 3 forwarding is done by routers using IP addresses. A multilayer switch can do both, but standard switches are Layer 2 only.';
    }
    if (qText.indexOf('throughput') !== -1 && qText.indexOf('bandwidth') !== -1) {
      return 'False. Throughput is the actual speed you see in practice; bandwidth is the theoretical maximum. Network congestion, overhead, and interference always make throughput lower than bandwidth.';
    }
    if (qText.indexOf('redundancy') !== -1 && qText.indexOf('prevent') !== -1) {
      return 'False. Redundancy improves availability by routing around failed links, but it cannot prevent all outages. If all paths fail at once or the network equipment fails, redundancy does not help.';
    }
    if (qText.indexOf('full.?duplex') !== -1 && qText.indexOf('csma') !== -1) {
      return 'False. Full-duplex allows simultaneous send/receive, so there are no collisions. CSMA/CD is only needed in half-duplex (shared medium) where collisions can occur.';
    }
    if (qText.indexOf('fiber optic') !== -1 && qText.indexOf('emi') !== -1) {
      return 'False. Fiber optic uses light, not electrical signals, so it is immune to electromagnetic interference. Copper cables (UTP, STP) are susceptible to EMI.';
    }
    if (qText.indexOf('tcp') !== -1 && qText.indexOf('ip') !== -1 && qText.indexOf('layer') !== -1) {
      return 'False. The OSI model has 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application). The TCP/IP model is simpler with only 4 layers (Network Access, Internet, Transport, Application). OSI is more granular; TCP/IP is more practical.';
    }
    if (qText.indexOf('ipv6') !== -1 && (qText.indexOf('hexadecimal') !== -1 || qText.indexOf('colon') !== -1)) {
      return 'True. IPv6 uses hexadecimal notation (0-F) separated by colons. Example: 2001:0db8:85a3::8a2e:0370:7334. This is different from IPv4 which uses decimal (0-255) separated by dots.';
    }
    if (qText.indexOf('default gateway') !== -1 && qText.indexOf('subnet') !== -1) {
      return 'True. The default gateway must be on the same subnet as the host. It is the local router interface used to send packets to other networks. If not on the same subnet, the host cannot reach it.';
    }
    if (qText.indexOf('/31') !== -1 && qText.indexOf('usable') !== -1) {
      return 'False. A /31 subnet has only 2 addresses total, leaving 0 usable hosts (since normally 2 are reserved for network and broadcast). However, RFC 3021 allows point-to-point links to use both addresses. Standard subnetting expects /30 minimum for usable hosts.';
    }
    if (qText.indexOf('arp') !== -1 && (qText.indexOf('broadcast') !== -1 || qText.indexOf('discovers') !== -1)) {
      return 'True. ARP sends a broadcast request to the entire local network asking "Who has IP X?" The device with that IP replies with its MAC address. This is how hosts discover MAC addresses on the same LAN.';
    }
    if (qText.indexOf('session') !== -1 && qText.indexOf('physical') !== -1) {
      return 'False. The Physical Layer (Layer 1) handles raw bit transmission via cables and signals. Session management is a Layer 5 (Session Layer) function for maintaining connections. They are completely different responsibilities.';
    }
    if (qText.indexOf('access port') !== -1 && qText.indexOf('vlan') !== -1) {
      return 'False. Access ports belong to a single VLAN and are untagged. Trunk ports carry multiple VLANs using 802.1Q tagging. End devices connect to access ports; switches connect via trunk ports.';
    }
    if (qText.indexOf('stp') !== -1 && qText.indexOf('path cost') !== -1 && qText.indexOf('highest') !== -1) {
      return 'False. STP selects the root port (and other ports) using the LOWEST path cost to the root bridge. Higher-cost ports become blocked to prevent loops. Lower cost = preferred = actively forwarding.';
    }
    if (qText.indexOf('root bridge') !== -1 && qText.indexOf('mac address') !== -1 && qText.indexOf('only') !== -1) {
      return 'False. Root bridge election uses Bridge ID (priority + MAC), not MAC address alone. Priority is considered first; if tied, the lowest MAC wins. Admins can manipulate priority to select a specific root bridge.';
    }
    if (qText.indexOf('stp') !== -1 && qText.indexOf('listening') !== -1 && qText.indexOf('learning') !== -1) {
      return 'True. STP uses Listening (30 sec, no learning) and Learning (15 sec, build MAC table) states before Forwarding. This prevents temporary loops during convergence. Only Forwarding state passes user data.';
    }
    if (qText.indexOf('static route') !== -1 && qText.indexOf('topology') !== -1) {
      return 'False. Static routes do not automatically adapt to topology changes. They must be manually updated or use floating static routes (higher AD) as dynamic backup. Dynamic protocols (OSPF, EIGRP) adapt automatically.';
    }
    if (qText.indexOf('link.?state') !== -1 && qText.indexOf('routing table') !== -1) {
      return 'False. Link-state protocols send only topology changes (LSAs = Link State Advertisements) when triggered, not entire routing tables periodically. RIP v1 sends full tables; newer protocols are more efficient.';
    }
    if (qText.indexOf('rip') !== -1 && (qText.indexOf('enterprise') !== -1 || qText.indexOf('ospf') !== -1)) {
      return 'False. OSPF is preferred in large enterprise networks over RIP. RIP\'s 15-hop limit, slow convergence (180+ seconds), and high bandwidth overhead make it unsuitable. OSPF scales to thousands of routers.';
    }
    if (qText.indexOf('vlan') !== -1 && qText.indexOf('router') !== -1) {
      return 'False. Different VLANs are separate broadcast domains. Traffic cannot flow between them without a router (Layer 3 device) performing inter-VLAN routing. This is the main security and scalability benefit of VLANs.';
    }
    if (qText.indexOf('udp') !== -1 && qText.indexOf('guarantee') !== -1) {
      return 'False. UDP provides no delivery guarantees. Packets can be lost, duplicated, or arrive out of order. UDP is connectionless and fast (real-time apps). TCP guarantees ordered reliable delivery.';
    }
    return buildFallbackExplanation(question, module, isCorrect);
  }

  // ===== IDENTIFICATION / FILL-BLANK =====
  if ((question && question.type === 'identification') || (question && question.type === 'fill-blank')) {
    if (qText.indexOf('network address') !== -1 && qText.indexOf('192.168') !== -1) {
      return 'The network address is the first IP in the subnet where all host bits are 0. For 192.168.1.130/25, the /25 means only the last 7 bits are hosts. 130 in binary is 10000010; with /25, the network is 128-255, so the network address is 192.168.1.128.';
    }
    if (qText.indexOf('subnet') !== -1 && (qText.indexOf('/26') !== -1 || qText.indexOf('/25') !== -1)) {
      return 'With /26, each subnet has 64 addresses (2^6). Find which block of 64 contains your IP. For 192.168.1.193/26: blocks are 0-63, 64-127, 128-191, 192-255. 193 falls in 192-255, so the subnet is 192.168.1.192/26.';
    }
    if (qText.indexOf('broadcast') !== -1 && qText.indexOf('10.20.30') !== -1) {
      return 'The broadcast address is the last IP in a subnet where all host bits are 1. For 10.20.30.0/25, the first subnet is .0-.127, so broadcast is 10.20.30.127. Hosts use .1-.126 (128-2=126 usable).';
    }
    if (qText.indexOf('usable host') !== -1 && qText.indexOf('172.16') !== -1) {
      return 'The formula is 2^(32 - CIDR) - 2. For /22: 2^(32-22) - 2 = 2^10 - 2 = 1024 - 2 = 1022 usable hosts. Subtract 2 for network and broadcast addresses.';
    }
    if (qText.indexOf('connect multiple networks') !== -1 || qText.indexOf('best path') !== -1) {
      return 'A router connects separate networks and uses routing tables to choose the best path. Layer 3 IP-based forwarding. Switches cannot do this; they only forward within one network using MAC addresses.';
    }
    if (qText.indexOf('connect wireless') !== -1 || qText.indexOf('wireless.*wired') !== -1) {
      return 'A wireless access point bridges Wi-Fi clients to the wired LAN. It is not a router (does not route between networks) and not a switch (does not forward based on MAC addresses in the traditional sense).';
    }
    if (qText.indexOf('mac address') !== -1) {
      return 'A MAC address is a 48-bit (6-byte) physical address in hexadecimal format: AA:BB:CC:DD:EE:FF. It is used at Layer 2 for local delivery inside a LAN. Routers change MAC addresses; IP addresses route across networks.';
    }
    if (qText.indexOf('fcs') !== -1 || qText.indexOf('frame check') !== -1) {
      return 'FCS (Frame Check Sequence) is a 4-byte checksum at Layer 2 that detects bit errors in the frame. If corrupted, the frame is discarded. This is error detection, not correction.';
    }
    if (qText.indexOf('wrapped') !== -1 && qText.indexOf('protocol') !== -1 && qText.indexOf('header') !== -1) {
      return 'Encapsulation is the process of adding protocol headers and trailers at each layer as data travels down the OSI stack. At Layer 4 it becomes a segment, at Layer 3 a packet, at Layer 2 a frame. Each layer adds its own addressing and control information, then passes it down. Decapsulation removes these headers as data goes up the stack on the receiving end.';
    }
    if (qText.indexOf('arp') !== -1) {
      return 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses. When a host knows an IP but not the MAC, it broadcasts an ARP request. The device with that IP replies with its MAC address.';
    }
    if (qText.indexOf('three.?way handshake') !== -1) {
      return 'TCP three-way handshake: (1) Client sends SYN to initiate, (2) Server replies with SYN-ACK, (3) Client sends ACK to confirm. Both sides then know the connection is ready.';
    }
    if (qText.indexOf('first usable') !== -1) {
      return 'The first usable host address is the network address plus 1. For 10.20.30.0/25, the network is .0-.127, so the first usable host is .1. The last is .126 (broadcast is .127).';
    }
    if (qText.indexOf('loopback') !== -1 || qText.indexOf('127') !== -1) {
      return '127.0.0.1 is the IPv4 loopback address, reserved for testing the local TCP/IP stack. Pinging 127.0.0.1 verifies that networking protocols are installed and working on the local device.';
    }
    if (qText.indexOf('topology') !== -1 && qText.indexOf('arrangement') !== -1) {
      return 'Topology is the physical or logical arrangement of devices in a network. Common topologies: star (central switch), bus (shared cable), ring (circular loop), mesh (redundant paths), hybrid (combination). The topology affects fault tolerance and performance.';
    }
    if (qText.indexOf('latency') !== -1 && qText.indexOf('delay') !== -1) {
      return 'Latency is the time delay between sending and receiving data, measured in milliseconds. It\'s different from bandwidth (speed capacity) and throughput (actual speed achieved). Low latency is critical for real-time applications like VoIP and online gaming.';
    }
    if (qText.indexOf('presentation') !== -1 && qText.indexOf('layer') !== -1 && qText.indexOf('format') !== -1) {
      return 'The Presentation Layer (Layer 6) handles data formatting, encryption, compression, and translation between different character sets. It prepares data for the Application Layer and ensures data from different systems can be understood.';
    }
    if (qText.indexOf('segment') !== -1 && (qText.indexOf('transport') !== -1 || qText.indexOf('layer 4') !== -1)) {
      return 'A segment is the Protocol Data Unit (PDU) at the Transport Layer (Layer 4). TCP creates segments with sequence numbers for reliable delivery. UDP creates datagrams. Segments are reassembled at the destination into the original application data.';
    }
    if (qText.indexOf('tcp') !== -1 && qText.indexOf('ip') !== -1 && qText.indexOf('practical') !== -1) {
      return 'The TCP/IP model is more practical and widely used than the OSI model in real networks. TCP/IP has 4 layers (Network Access, Internet, Transport, Application) vs OSI\'s 7. Most networking is built on TCP/IP, making it the de facto standard.';
    }
    if (qText.indexOf('decapsulation') !== -1) {
      return 'Decapsulation is the process of removing headers and trailers as data moves UP the protocol stack at the receiving end. Layer 2 removes frame headers, Layer 3 removes IP headers, Layer 4 removes TCP/UDP headers, etc. Opposite of encapsulation.';
    }
    if (qText.indexOf('vlan') !== -1 && (qText.indexOf('802.1q') !== -1 || qText.indexOf('tag') !== -1)) {
      return '802.1Q is the IEEE standard for VLAN tagging on trunk links. It inserts a 4-byte VLAN tag into Ethernet frames containing the VLAN ID (12 bits). This allows switches to carry multiple VLANs over one physical trunk link.';
    }
    if (qText.indexOf('trunk') !== -1 && (qText.indexOf('vlan') !== -1 || qText.indexOf('port') !== -1)) {
      return 'A trunk port is a switch port that carries traffic from multiple VLANs. Trunk ports use 802.1Q tagging to identify VLAN membership in frames. Access ports carry one VLAN untagged. Trunk ports connect switches together or to routers for inter-VLAN routing.';
    }
    if (qText.indexOf('stp') !== -1 && qText.indexOf('bpdu') !== -1) {
      return 'BPDUs (Bridge Protocol Data Units) are special frames switches exchange to build the spanning tree. They contain Bridge ID (priority + MAC), path cost, and port roles. The root bridge sends BPDUs; other switches relay them to build the loop-free topology.';
    }
    if (qText.indexOf('stp') !== -1 && (qText.indexOf('path') !== -1 && qText.indexOf('cost') !== -1)) {
      return 'Path cost in STP is the accumulated cost along a path to the root bridge. Each port has a cost (default 1000/bandwidth). Lower path cost = better route. Root port is the port with lowest cost to root. Used to break ties in spanning tree election.';
    }
    if (qText.indexOf('portfast') !== -1 || (qText.indexOf('port') !== -1 && qText.indexOf('access') !== -1 && qText.indexOf('stp') !== -1)) {
      return 'PortFast is a Cisco feature that skips Listening and Learning states on access ports, moving directly to Forwarding. This speeds connection setup for end devices (seconds instead of 50+ seconds). Access ports should use PortFast; trunk ports must NOT.';
    }
    if (qText.indexOf('rstp') !== -1) {
      return 'RSTP (Rapid Spanning Tree Protocol, 802.1w) improves STP by enabling faster port transitions and more responsive topology changes. Convergence takes seconds vs 50+ seconds for STP. It uses better BPDU handling and edge port/backup port concepts.';
    }
    if (qText.indexOf('broadcast domain') !== -1) {
      return 'A broadcast domain is a group of network devices that receive each other\'s broadcast frames. Switches do not separate broadcast domains. Routers do. VLANs are separate broadcast domains. A switch creates only one broadcast domain; a router with 4 interfaces creates 4 broadcast domains.';
    }
    if (qText.indexOf('ospf') !== -1 && (qText.indexOf('area') !== -1 || qText.indexOf('hierarchy') !== -1)) {
      return 'Areas in OSPF are logical groupings of routers that reduce link-state database size and improve scalability. Area 0 is the backbone. Other areas connect via Area Border Routers (ABRs). This hierarchical design lets OSPF scale to thousands of routers.';
    }
    if (qText.indexOf('dijkstra') !== -1 || (qText.indexOf('ospf') !== -1 && qText.indexOf('shortest path') !== -1)) {
      return 'Dijkstra is the Shortest Path First (SPF) algorithm used by OSPF. It builds a tree rooted at the local router, incrementally finding shortest paths to all destinations. Guarantees loop-free paths and optimal routing within the OSPF domain.';
    }
    if (qText.indexOf('rip') !== -1 && qText.indexOf('hop') !== -1) {
      return 'Hop count is the metric used by RIP, representing the number of router hops to reach a destination. Each hop adds 1. RIP limits to 15 hops (16 = unreachable), restricting its use to small networks. OSPF and EIGRP have no practical limits.';
    }
    if (qText.indexOf('distance.?vector') !== -1) {
      return 'Distance-vector protocols (RIP, IGRP) use the Bellman-Ford algorithm. Routers only know routes from direct neighbors; they don\'t know the network topology. They periodically send entire routing tables, making convergence slow (180+ seconds) and prone to loops.';
    }
    if (qText.indexOf('classless') !== -1 || qText.indexOf('cidr') !== -1) {
      return 'Classless Interdomain Routing (CIDR, RFC 1918) enables flexible IP address allocation via variable-length prefixes (/24, /25, etc.). This replaced fixed classes (A 1-126, B 128-191, C 192-223), allowing efficient subnetting and longest-prefix-match routing.';
    }
    if (qText.indexOf('socket') !== -1 && (qText.indexOf('endpoint') !== -1 || qText.indexOf('ip') !== -1 || qText.indexOf('port') !== -1)) {
      return 'A socket uniquely identifies one end of a network connection. It combines IP address + port number (e.g., 192.168.1.1:443). Different applications on the same host use different port numbers. Sockets enable multiplexing multiple connections on one IP address.';
    }
    if (qText.indexOf('tcp') !== -1 && qText.indexOf('connection.?oriented') !== -1) {
      return 'TCP (Transmission Control Protocol) is connection-oriented: it establishes a connection via three-way handshake before sending data. It provides reliable ordered delivery with sequence numbers and acknowledgments. Slower than UDP but suitable for email, web, file transfers.';
    }
    if (qText.indexOf('well.?known port') !== -1 || (qText.indexOf('port') !== -1 && qText.indexOf('0.?1023') !== -1)) {
      return 'Well-known ports (0-1023) are reserved for standard system services: HTTP (80), HTTPS (443), SSH (22), DNS (53), SMTP (25), Telnet (23), FTP (21), POP3 (110). Registered ports (1024-49151) are assigned to vendor applications. Dynamic ports (49152-65535) are free.';
    }
    if (qText.indexOf('ssh') !== -1 && (qText.indexOf('22') !== -1 || qText.indexOf('port') !== -1)) {
      return 'SSH (Secure Shell) uses port 22 for encrypted remote terminal access. It replaces unencrypted Telnet (port 23). SSH encrypts credentials, commands, and file transfers. All network device management (routers, switches) should use SSH instead of Telnet.';
    }
    if (qText.indexOf('dhcp') !== -1) {
      return 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to clients. Clients broadcast DHCP Discover, server replies with DHCP Offer, client requests with DHCP Request, server acknowledges with DHCP ACK.';
    }
    if (qText.indexOf('ftp') !== -1 && qText.indexOf('20') !== -1) {
      return 'FTP (File Transfer Protocol) uses two ports: port 21 for control/commands and port 20 for data transfer. This separation allows the control connection to stay open while files transfer on the data port. SFTP (SSH FTP, port 22) is more secure.';
    }
    if (qText.indexOf('udp') !== -1 && qText.indexOf('connectionless') !== -1) {
      return 'UDP (User Datagram Protocol) is connectionless: it sends datagrams without setup, acknowledgment, or ordering guarantees. Packets can be lost, duplicated, or arrive out of order. UDP has minimal overhead and latency, ideal for real-time apps (VoIP, gaming, video streaming).';
    }
    if (qText.indexOf('wireless') !== -1 && qText.indexOf('access point') !== -1) {
      return 'A wireless access point (WAP) bridges Wi-Fi clients to the wired LAN by receiving wireless signals and forwarding them to the wired network. It is not a router (does not route between networks) and not a switch (does not switch between VLANs). Layer 1-2 connectivity only.';
    }
    if (qText.indexOf('listens to the medium') !== -1) {
      return 'Carrier Sense is the process where a device listens to the medium (checks if it is clear) before transmitting. CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is the half-duplex access method. Full-duplex has no collisions so no carrier sense is needed.';
    }
    if (qText.indexOf('connect two pcs') !== -1 || qText.indexOf('directly without a switch') !== -1) {
      return 'A crossover cable reverses the pin order between its two ends (T568A on one end, T568B on the other). This allows direct PC-to-PC or switch-to-switch connection. Straight-through cables (identical pinout) are used for PC-to-switch or router-to-switch connections.';
    }
    if (qText.indexOf('immune to') !== -1 && qText.indexOf('electromagnetic') !== -1) {
      return 'Fiber optic cables use light signals instead of electrical signals, making them immune to electromagnetic interference (EMI). Copper cables (UTP, STP) are susceptible to EMI from power lines and radio signals. Fiber also supports longer distances (10+ km) and higher bandwidth.';
    }
    if (qText.indexOf('interface') !== -1 && qText.indexOf('network') !== -1) {
      return 'A network interface is a device\'s connection point to the network. Each interface has a unique MAC address (Layer 2), IP address (Layer 3), and port number on the switch. Routers have multiple interfaces, one per network they connect to.';
    }
    return buildFallbackExplanation(question, module, isCorrect);
  }

  // ===== MULTIPLE CHOICE =====
  if (question && question.type === 'multiple-choice' && question.options && question.answer !== undefined) {
    if (qText.indexOf('layer') !== -1) {
      if (correctText && correctText.toLowerCase().indexOf('physical') !== -1) {
        return 'Layer 1 (Physical): Transmits raw bits as electrical or optical signals on the medium (cables, fiber). No frames, no MAC addresses. Layer 2 adds framing; Layer 3 adds IP routing.';
      } else if (correctText && correctText.toLowerCase().indexOf('data link') !== -1) {
        return 'Layer 2 (Data Link): Creates frames and uses MAC addresses for local delivery on the same network. A switch is a Layer 2 device. Routers (Layer 3) handle routing between networks.';
      } else if (correctText && correctText.toLowerCase().indexOf('network') !== -1) {
        return 'Layer 3 (Network): Uses IP addresses and routing tables to forward packets between networks. Routers operate here. This is where inter-network communication happens, not local delivery.';
      } else if (correctText && correctText.toLowerCase().indexOf('transport') !== -1) {
        return 'Layer 4 (Transport): TCP (reliable, ordered) and UDP (fast, no guarantee) operate here. This layer manages end-to-end reliability and ports, not the physical or link layers.';
      }
    }
    if (qText.indexOf('802.1q') !== -1 || (qText.indexOf('tag') !== -1 && qText.indexOf('vlan') !== -1)) {
      if (qText.indexOf('support') !== -1 || qText.indexOf('4094') !== -1 || qText.indexOf('vlan id') !== -1) {
        return '802.1Q supports VLAN IDs 1-4094 (4096 total IDs minus reserved 0 and 4095). Standard range 1-1005, extended range 1006-4094. ID 1 is the default VLAN on many Cisco switches. Higher IDs are used in large networks.';
      } else {
        return '802.1Q is the IEEE standard for VLAN tagging on trunk links. It inserts a 4-byte VLAN tag into Ethernet frames containing the VLAN ID. This allows switches to carry multiple VLANs over a single physical trunk link.';
      }
    }
    if (qText.indexOf('gateway') !== -1) {
      return 'A gateway translates between different networks or protocols, enabling incompatible systems to communicate. This is different from a router (inter-network forwarding) or switch (local forwarding).';
    }
    if (qText.indexOf('hub') !== -1) {
      return 'A hub is Layer 1: it repeats signals to all ports, creating a shared collision domain. Every device hears every transmission. A switch is smarter (Layer 2) and learns MAC addresses to forward selectively.';
    }
    if (qText.indexOf('switch') !== -1) {
      return 'A switch is Layer 2: it builds a MAC address table and forwards frames only to the correct port. It reduces collisions and improves efficiency compared to a hub. Routers (Layer 3) forward between networks.';
    }
    if (qText.indexOf('router') !== -1) {
      return 'A router is Layer 3: it uses IP addresses and routing tables to send packets between networks. It is the gateway between subnets or the internet. Switches forward within a LAN; routers forward between LANs.';
    }
    if (qText.indexOf('wireless') !== -1 && qText.indexOf('wired') !== -1) {
      return 'A wireless access point (WAP) bridges Wi-Fi clients to the wired LAN. It is Layer 1-2 connectivity, not routing. A router would add Layer 3 forwarding between networks.';
    }
    if (qText.indexOf('redundancy') !== -1) {
      return 'Redundancy means having backup paths or equipment. If one link fails, traffic reroutes through another. This improves uptime and resilience, but cannot prevent simultaneous failures.';
    }
    if (qText.indexOf('man') !== -1 || qText.indexOf('wan') !== -1 || qText.indexOf('lan') !== -1 || qText.indexOf('geographic') !== -1 || qText.indexOf('covers approximately') !== -1) {
      return 'LAN (Local Area Network) covers one building/small area. MAN (Metropolitan) covers a city. WAN (Wide Area Network) spans multiple cities or regions. Geographic distance determines the type.';
    }
    if (qText.indexOf('subnet mask') !== -1 && qText.indexOf('255.255.255') !== -1) {
      return 'A subnet mask divides an IP into network and host portions. 255.255.255.0 (/24) leaves 8 bits for hosts. 255.255.255.192 (/26) leaves 6 bits, so 2^6 = 64 addresses per subnet.';
    }
    if (qText.indexOf('csma') !== -1) {
      return 'CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is used in half-duplex Ethernet. Devices listen before transmitting; if collision occurs, they wait and retry. Full-duplex eliminates collisions.';
    }
    if (qText.indexOf('cable type') !== -1 && qText.indexOf('electromagnetic') !== -1) {
      return 'Fiber optic cables use light signals instead of electrical signals, making them immune to electromagnetic interference (EMI). Copper cables (UTP, STP) are susceptible to EMI from power lines and radio signals. Fiber also supports longer distances (10+ km) and higher bandwidth.';
    }
    if (qText.indexOf('ipv4 class') !== -1 && qText.indexOf('host') !== -1) {
      return 'Class A (1-126) supports 16 million hosts per network. Class B (128-191) supports 65,000 hosts. Class C (192-223) supports 254 hosts. Class A has the most addresses because only 8 bits are reserved for the network.';
    }
    if (qText.indexOf('subnet mask') !== -1 && qText.indexOf('/16') !== -1) {
      return '/16 means 16 bits are for the network, 16 bits for hosts. Subnet mask is 255.255.0.0. This creates 2^16 = 65,536 addresses per subnet, with 65,534 usable hosts (subtract network and broadcast).';
    }
    if (qText.indexOf('class b') !== -1 && qText.indexOf('first octet') !== -1) {
      return 'Class B uses first two bits 10, so first octet ranges 128-191. The first octet binary patterns: 10xxxxxx. This range reserves 2^14 networks, each with 2^16 hosts. Classful addressing limits but is foundational to understanding IPv4.';
    }
    if (qText.indexOf('ipv4 class') !== -1 && qText.indexOf('255') !== -1) {
      return 'Class A networks (1.0.0.0 to 126.255.255.255) with /8 mask (255.0.0.0): 1 network bit, 24 host bits = 16 million hosts each. Class B (128-191) with /16 mask (255.255.0.0): 65,000 hosts each. Class C (192-223) with /24 mask (255.255.255.0): 254 hosts each.';
    }
    if (qText.indexOf('network address') !== -1 && qText.indexOf('/25') !== -1) {
      return 'With /25, only 7 bits are for hosts (2^7 = 128 addresses). IP 192.168.1.130 in binary ends with 10000010. The /25 splits into blocks of 128: 0-127 and 128-255. 130 falls in the 128-255 block, so network is 192.168.1.128/25.';
    }
    if (qText.indexOf('/26') !== -1 && (qText.indexOf('192.168.1.193') !== -1 || qText.indexOf('subnet') !== -1)) {
      return '/26 provides 6 host bits = 64 addresses per subnet. Blocks: 0-63, 64-127, 128-191, 192-255. IP 192.168.1.193 falls in block 192-255, so the network is 192.168.1.192/26. This means hosts .193-.254 with broadcast .255.';
    }
    if (qText.indexOf('usable host') !== -1 && qText.indexOf('1022') !== -1) {
      return '/22 means 32-22 = 10 host bits. Formula: 2^10 - 2 = 1024 - 2 = 1022 usable hosts (subtract network .0 and broadcast .255). 172.16.0.0/22 covers .0 to .1023 with 1024 total addresses and 1022 usable.';
    }
    if (qText.indexOf('/30') !== -1 && qText.indexOf('usable') !== -1) {
      return '/30 provides 2 host bits = 4 addresses per subnet. With 2 reserved (network and broadcast), there are 2 usable hosts. /30 is commonly used for point-to-point links like router-to-router connections.';
    }
    if (qText.indexOf('ipv4') !== -1 && qText.indexOf('32') !== -1 && qText.indexOf('bit') !== -1) {
      return 'IPv4 addresses are 32 bits total, typically divided into 4 octets of 8 bits each. For example, 192.168.1.1 is 11000000.10101000.00000001.00000001 in binary. This 32-bit limit allows ~4.3 billion unique addresses, which is why IPv6 (128-bit) was created.';
    }
    if (qText.indexOf('/23') !== -1 && qText.indexOf('address') !== -1) {
      return '/23 provides 9 host bits = 2^9 = 512 addresses per subnet. Network 172.16.0.0/23 covers 512 addresses (172.16.0.0 through 172.16.1.255). Each /23 block increments by 512, so next is 172.16.2.0/23.';
    }
    if (qText.indexOf('binary') !== -1 && qText.indexOf('10001100') !== -1) {
      return '10001100 = 128+8+4 = 140 (first octet). 10101000 = 128+32+8 = 168 (second). 00000001 = 1 (third). 00000001 = 1 (fourth). Binary conversion is key to subnetting: each bit position represents a power of 2 (128, 64, 32, 16, 8, 4, 2, 1).';
    }
    if (qText.indexOf('vlan') !== -1 && qText.indexOf('802.1q') !== -1) {
      return '802.1Q is the IEEE standard for VLAN tagging on trunk links. It inserts a 4-byte VLAN tag into Ethernet frames containing the VLAN ID. This allows switches to carry multiple VLANs over a single physical trunk link.';
    }
    if (qText.indexOf('vlan') !== -1 && qText.indexOf('4094') !== -1) {
      return '802.1Q supports VLAN IDs 1-4094 (4096 total IDs minus reserved 0 and 4095). Standard range 1-1005, extended range 1006-4094. ID 1 is the default VLAN on many Cisco switches. Higher IDs are used in large networks.';
    }
    if (qText.indexOf('vlan') !== -1 && qText.indexOf('802.1q') !== -1 && qText.indexOf('standard') !== -1) {
      return 'Standard VLAN range is 1-1005 (usable on most Cisco switches). Extended range is 1006-4094 (requires different database mode). VLANs 1-4094 are officially defined by 802.1Q. 1 is default, 4095 reserved for protocol use.';
    }
    if (qText.indexOf('trunk') !== -1 && qText.indexOf('vlan') !== -1) {
      return 'A trunk port carries traffic from multiple VLANs by tagging frames with VLAN IDs (802.1Q). Access ports belong to a single VLAN and do not tag frames. Router-on-a-stick (single router port trunked) enables inter-VLAN routing.';
    }
    if (qText.indexOf('access port') !== -1 && qText.indexOf('vlan') !== -1) {
      return 'Access ports belong to exactly one VLAN and do not carry tagged frames. End devices (PCs, servers) connect to access ports. Trunk ports (switch-to-switch, switch-to-router) carry multiple VLANs using 802.1Q tags.';
    }
    if (qText.indexOf('inter.?vlan') !== -1 && qText.indexOf('layer') !== -1) {
      return 'Inter-VLAN communication requires Layer 3 routing because VLANs are separate broadcast domains. A router (Layer 3 device) receives frames from one VLAN, removes the VLAN tag, routes the IP packet, and forwards it to another VLAN.';
    }
    if (qText.indexOf('stp') !== -1 && qText.indexOf('forwarding') !== -1 && qText.indexOf('state') !== -1) {
      return 'Forwarding is the only STP port state where user data is transmitted. Ports must first pass through Listening (no learning) and Learning (builds MAC table) states before reaching Forwarding. This prevents loops as the spanning tree converges.';
    }
    if (qText.indexOf('path cost') !== -1 && qText.indexOf('root port') !== -1) {
      return 'In STP, the root port is the port with the LOWEST path cost to the root bridge. This port actively forwards toward the root. Higher-cost ports become blocked. Path cost default: 1000/bandwidth (e.g., 1 Gbps = 1000, 10 Mbps = 100).';
    }
    if (qText.indexOf('bpdu') !== -1) {
      return 'BPDUs (Bridge Protocol Data Units) are frames switches exchange to build the spanning tree. They contain the sender\'s Bridge ID (priority + MAC) and path cost. The switch with the lowest Bridge ID becomes the root bridge. Root floods BPDUs to all ports.';
    }
    if (qText.indexOf('stp') !== -1 && qText.indexOf('priority') !== -1) {
      return 'Default Cisco STP priority is 32768 (can be 0-61440 in multiples of 4096). Lower priority wins root bridge election. Bridge ID = Priority + MAC address. If priorities are equal, lowest MAC wins. Admins often set root to desired switch with lower priority.';
    }
    if (qText.indexOf('portfast') !== -1) {
      return 'PortFast is a Cisco STP feature that skips the Listening and Learning states on access ports, moving directly to Forwarding. This speeds up connections for end devices (PCs) and prevents loops because access ports connect to end devices, not switches.';
    }
    if (qText.indexOf('rstp') !== -1 && qText.indexOf('convergence') !== -1) {
      return 'RSTP (Rapid STP, 802.1w) dramatically reduces convergence time by using point-to-point and edge port optimizations. While STP takes ~50 seconds (forward delay x3), RSTP converges in seconds. It recognizes topology changes faster via BPDUs.';
    }
    if (qText.indexOf('bridge id') !== -1 || (qText.indexOf('stp') !== -1 && qText.indexOf('priority') !== -1 && qText.indexOf('mac') !== -1)) {
      return 'Bridge ID = Priority (2 bytes) + MAC Address (6 bytes). During root election, switches compare Bridge IDs. The lowest Bridge ID becomes the root. If priorities tie, the switch with the lowest MAC address is chosen. Admins manipulate priority to elect a specific root bridge.';
    }
    if (qText.indexOf('connected') !== -1 && qText.indexOf('administrative distance') !== -1) {
      return 'Connected routes have AD 0 (most trusted). Static routes have AD 1. EIGRP has AD 90, OSPF 110, RIP 120. Lower AD = higher trust. When multiple routes to the same destination exist, the router uses the route with lowest AD.';
    }
    if (qText.indexOf('routing table') !== -1 && qText.indexOf('multiple route') !== -1) {
      return 'A routing table can hold multiple routes to the same destination if they have equal cost (equal-cost load balancing) or different administrative distances (only the lowest AD is used). This enables failover if the primary route fails.';
    }
    if (qText.indexOf('static route') !== -1 && qText.indexOf('administrative distance') !== -1 && qText.indexOf('1') !== -1) {
      return 'Static routes have AD 1 (higher than connected AD 0, lower than dynamic protocols like OSPF 110). Static routes don\'t adapt to topology changes automatically, so they should be used for specific routes or backup links.';
    }
    if (qText.indexOf('connected') !== -1 && (qText.indexOf('show ip route') !== -1 || qText.indexOf('routing table') !== -1)) {
      return 'In Cisco "show ip route" output, "C" represents a connected route (network directly attached to a router interface). These have AD 0 and are the most trusted routes because they don\'t depend on external routing protocols.';
    }
    if (qText.indexOf('longest prefix match') !== -1) {
      return 'Longest prefix match means a router chooses the most specific route (highest CIDR prefix) to a destination. If routing table has both 192.168.0.0/16 and 192.168.1.0/24, a packet for 192.168.1.10 matches the /24 route because it is more specific.';
    }
    if (qText.indexOf('administrative distance') !== -1 && qText.indexOf('lower') !== -1) {
      return 'Lower administrative distance means a routing protocol is MORE trusted. Connected (0) is highest trust, Static (1) next, then EIGRP (90), OSPF (110), RIP (120). When multiple routes exist, the one with lowest AD is installed in the routing table.';
    }
    if (qText.indexOf('bellman.?ford') !== -1 || (qText.indexOf('distance.?vector') !== -1 && qText.indexOf('algorithm') !== -1)) {
      return 'Bellman-Ford is the algorithm used by distance-vector routing protocols (RIP, IGRP, EIGRP). Routers share their entire routing table with neighbors. Routers do not know the topology, only metrics/distances. Can cause routing loops if convergence is slow.';
    }
    if (qText.indexOf('0.0.0.0') !== -1 && qText.indexOf('default') !== -1) {
      return '0.0.0.0/0 is the default route. If no specific route matches a packet\'s destination, it uses the default route (gateway of last resort) to forward toward the internet. Usually points to an ISP router in enterprise networks.';
    }
    if (qText.indexOf('routing table') !== -1 && qText.indexOf('outgoing interface') !== -1) {
      return 'A router uses its routing table to select the outgoing interface. First, it finds the most specific matching route (longest prefix match). Then it extracts the next-hop IP and looks up that IP\'s interface (recursive lookup) to forward the packet.';
    }
    if (qText.indexOf('eigrp') !== -1 && qText.indexOf('cisco') !== -1) {
      return 'EIGRP (Enhanced Interior Gateway Routing Protocol) is a proprietary protocol developed by Cisco. It is a hybrid protocol combining link-state (topology awareness) and distance-vector (neighbor exchanges) features. More efficient than OSPF for Cisco-only networks.';
    }
    if (qText.indexOf('link.?state') !== -1 && qText.indexOf('routing table') !== -1) {
      return 'Link-state protocols (OSPF, IS-IS) send only topology changes (LSAs = Link State Advertisements) when triggered, not full routing tables periodically. Routers build a complete network topology map and calculate shortest paths using algorithms like Dijkstra.';
    }
    if (qText.indexOf('rip') !== -1 && qText.indexOf('metric') !== -1) {
      return 'RIP uses hop count as its metric (number of router hops to destination). Each hop adds 1. Maximum is 15 hops; 16 means unreachable. RIP is simple but limited in large networks. OSPF uses cost (inverse bandwidth), allowing better path selection.';
    }
    if (qText.indexOf('classless routing') !== -1) {
      return 'Classless routing (CIDR, RFC 1878) separates IP address from its length, using CIDR notation like 192.168.0.0/24. Routers perform longest prefix match to select the most specific route. This replaced fixed-class networks (A, B, C) and enables flexible subnetting.';
    }
    if (qText.indexOf('ospf') !== -1 && (qText.indexOf('dijkstra') !== -1 || qText.indexOf('spf') !== -1)) {
      return 'OSPF uses Dijkstra\'s Shortest Path First (SPF) algorithm to compute the most efficient route tree. The router treats itself as root, calculates distances to all neighbors, and selects the lowest-cost path to each destination.';
    }
    if (qText.indexOf('static route') !== -1 && qText.indexOf('adapt') !== -1) {
      return 'Static routes do not automatically adapt to topology changes. If the primary path fails, an administrator must manually update the route or use a floating static route (higher AD) as backup that activates only when the primary fails.';
    }
    if (qText.indexOf('distance.?vector') !== -1 && qText.indexOf('neighbor') !== -1) {
      return 'Distance-vector protocols only know about routes from directly connected neighbors; they don\'t have a complete network map. They periodically send their entire routing table to neighbors (RIP every 30 seconds). Slower convergence and prone to loops.';
    }
    if (qText.indexOf('ospf') !== -1 && qText.indexOf('administrative distance') !== -1 && qText.indexOf('110') !== -1) {
      return 'OSPF has AD 110 (lower than RIP at 120 but higher than EIGRP at 90 and Static at 1). This means OSPF routes are trusted more than RIP but less than static or connected routes. Used in large multi-vendor networks.';
    }
    if (qText.indexOf('ospf') !== -1 && qText.indexOf('area') !== -1) {
      return 'OSPF organizes routers into areas (OSPF hierarchy) to reduce the link-state database size and improve scalability. Area 0 is the backbone. Other areas connect via Area Border Routers (ABRs). Reduces flooding and SPF calculations.';
    }
    if (qText.indexOf('ospf') !== -1 && qText.indexOf('hello') !== -1 && qText.indexOf('10') !== -1) {
      return 'On broadcast OSPF networks (Ethernet, etc.), the default hello interval is 10 seconds. Routers exchange hello packets to discover neighbors. If 4 hellos are missed (dead interval 40 seconds), the neighbor is declared down.';
    }
    if (qText.indexOf('rip') !== -1 && qText.indexOf('subnet mask') !== -1) {
      return 'RIP v2 supports Variable Length Subnet Masks (VLSM), allowing efficient IP address allocation with different subnet sizes in the same network. RIP v1 does not. This is crucial for modern subnetting and routing flexibility.';
    }
    if (qText.indexOf('dijkstra') !== -1 || (qText.indexOf('ospf') !== -1 && qText.indexOf('algorithm') !== -1)) {
      return 'Dijkstra\'s algorithm (used by OSPF) builds a shortest-path tree by starting at the local router and incrementally adding the next nearest unvisited node. It guarantees the shortest path in a weighted graph (network).';
    }
    if (qText.indexOf('rip') !== -1 && qText.indexOf('hop') !== -1 && qText.indexOf('15') !== -1) {
      return 'RIP has a maximum hop count of 15. Networks 16+ hops away are considered unreachable. This limits RIP to small networks. OSPF and EIGRP have no practical hop limits, making them suitable for large enterprises.';
    }
    if (qText.indexOf('ospf') !== -1 && (qText.indexOf('database') !== -1 || qText.indexOf('topology') !== -1 || qText.indexOf('map') !== -1)) {
      return 'OSPF builds a complete link-state database (LSDB) representing the network topology as a graph. Each router stores LSAs (Link State Advertisements) from all other OSPF routers. This shared topology view enables faster convergence and loop-free paths.';
    }
    if (qText.indexOf('ospf') !== -1 && qText.indexOf('cost') !== -1 && (qText.indexOf('100') !== -1 || qText.indexOf('bandwidth') !== -1)) {
      return 'OSPF cost formula: Cost = 100,000,000 / bandwidth (in bps). Example: 1 Gbps link costs 100, 10 Mbps costs 10,000. Lower cost = preferred. This inverse-bandwidth metric prefers faster paths.';
    }
    if (qText.indexOf('rip') !== -1 && qText.indexOf('ospf') !== -1 && qText.indexOf('large') !== -1) {
      return 'OSPF is far superior to RIP in large enterprise networks. RIP\'s 15-hop limit, slow convergence (180+ seconds), and high bandwidth overhead make it unsuitable. OSPF converges in seconds, supports unlimited hops, and is optimized for complex topologies.';
    }
    if (qText.indexOf('ospf') !== -1 && qText.indexOf('dead') !== -1) {
      return 'OSPF dead interval (default 20 seconds on point-to-point links, 40 on broadcast) is how long a router waits before declaring a neighbor dead. If no hello received within this time, the neighbor is removed and routes via that neighbor are recalculated.';
    }
    if (qText.indexOf('ospf') !== -1 && (qText.indexOf('broadcast') !== -1 || (qText.indexOf('dr') !== -1 && qText.indexOf('bdr') !== -1))) {
      return 'On broadcast OSPF networks (Ethernet), routers elect a Designated Router (DR) and Backup DR (BDR). Only the DR generates LSAs and forms adjacencies with all routers. This reduces LSA flooding. DR election uses priority and Router ID.';
    }
    if (qText.indexOf('wifi') !== -1 && qText.indexOf('mimo') !== -1) {
      return 'MIMO (Multiple-Input Multiple-Output) was first introduced in 802.11n. It uses multiple antennas to transmit/receive data simultaneously, multiplying throughput. 802.11n achieves 600 Mbps, and later 802.11ac adds 5 GHz for 1.3 Gbps.';
    }
    if (qText.indexOf('5 ghz') !== -1 && (qText.indexOf('channel') !== -1 || qText.indexOf('2.4 ghz') !== -1)) {
      return '5 GHz band supports far more non-overlapping channels than 2.4 GHz. 2.4 GHz has only 3 non-overlapping channels (1, 6, 11 in North America). 5 GHz has 24+ channels, enabling more concurrent networks with less interference.';
    }
    if (qText.indexOf('bssid') !== -1 || qText.indexOf('mac address') !== -1 && qText.indexOf('wireless') !== -1) {
      return 'BSSID (Basic Service Set ID) is the MAC address of a wireless access point. SSID is the human-readable network name (e.g., "MyWiFi"). One AP can broadcast multiple SSIDs, but each has a unique BSSID. Users see SSID when scanning networks.';
    }
    if (qText.indexOf('wpa3') !== -1 || (qText.indexOf('wireless') !== -1 && qText.indexOf('secure') !== -1)) {
      return 'WPA3 is the most secure wireless standard (replacing WPA2). It uses 192-bit encryption for enterprise, 128-bit for personal, and Simultaneous Authentication of Equals (SAE) against password cracking. Protects against key recovery and brute-force attacks.';
    }
    if (qText.indexOf('ssid') !== -1 || (qText.indexOf('wireless') !== -1 && qText.indexOf('name') !== -1)) {
      return 'SSID (Service Set ID) is the wireless network name that users see when scanning for available networks. It is separate from BSSID (MAC address). One access point can broadcast multiple SSIDs. SSID can be hidden but devices still transmit probe requests when connecting.';
    }
    if (qText.indexOf('udp') !== -1 && qText.indexOf('video') !== -1) {
      return 'UDP is best for video streaming because it prioritizes speed over reliability. It has no connection setup, no retransmission, and lower latency. Losing a few packets is acceptable for real-time video. TCP would cause buffering from retransmissions.';
    }
    if (qText.indexOf('dns') !== -1 && qText.indexOf('tcp') !== -1 && qText.indexOf('53') !== -1) {
      return 'DNS primarily uses UDP port 53 for standard queries (fast, low overhead). TCP port 53 is used for zone transfers between authoritative DNS servers and for larger queries that exceed UDP\'s 512-byte limit.';
    }
    if (qText.indexOf('https') !== -1 && qText.indexOf('443') !== -1) {
      return 'HTTPS uses port 443 with TLS (Transport Layer Security) encryption. Compared to HTTP (port 80 unencrypted), HTTPS encrypts data in transit, protecting against eavesdropping. Certificate-based authentication also verifies the server\'s identity.';
    }
    if (qText.indexOf('tcp') !== -1 && (qText.indexOf('connection') !== -1 || qText.indexOf('reliable') !== -1)) {
      return 'TCP is connection-oriented: it establishes a connection via three-way handshake (SYN, SYN-ACK, ACK). It provides reliable ordered delivery via sequence numbers and acknowledgments. Flow control and error recovery make it slower but dependable (email, web, file transfer).';
    }
    if (qText.indexOf('port') !== -1 && qText.indexOf('0.?1023') !== -1) {
      return 'Well-known ports (0-1023) are reserved for system services (HTTP 80, HTTPS 443, DNS 53, SSH 22, SMTP 25). Registered ports (1024-49151) are assigned to applications. Dynamic/private ports (49152-65535) are available for any use.';
    }
    if (qText.indexOf('udp') !== -1 && (qText.indexOf('guarantee') !== -1 || qText.indexOf('order') !== -1)) {
      return 'UDP has no guarantees: packets can arrive out of order, be duplicated, or lost. It is connectionless (no setup), has low overhead, and minimal latency. Ideal for real-time apps (VoIP, gaming, streaming) where speed matters more than perfection.';
    }
    if (qText.indexOf('telnet') !== -1 && qText.indexOf('encrypt') !== -1) {
      return 'Telnet sends commands and credentials in plain text over port 23, making it insecure. SSH (port 22) encrypts all traffic, including passwords. SSH should always be used instead of Telnet for remote management.';
    }
    if (qText.indexOf('ssh') !== -1 && qText.indexOf('port') !== -1 && qText.indexOf('22') !== -1) {
      return 'SSH (Secure Shell) uses port 22 for encrypted remote terminal access. It encrypts login credentials, command output, and file transfers. SSH replaced Telnet as the secure standard for device management, including routers and switches.';
    }
    if (qText.indexOf('dhcp') !== -1) {
      return 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to clients. A DHCP client sends a discover request, the server replies with an offer, client requests the lease, and server acknowledges (DORA process).';
    }
    if (qText.indexOf('socket') !== -1 && (qText.indexOf('port') !== -1 || qText.indexOf('endpoint') !== -1)) {
      return 'A socket is the combination of IP address + port number. It uniquely identifies one end of a network connection. Example: 192.168.1.1:443 specifies the HTTPS server on host 192.168.1.1. Sockets enable multiple applications to use the same IP address on different ports.';
    }
    if (qText.indexOf('ftp') !== -1 && qText.indexOf('20') !== -1) {
      return 'FTP uses two ports: port 21 for control (commands), port 20 for data (file transfer). This separation allows the control connection to remain open while data flows on a different port. Passive mode changes this slightly. FTP sends credentials in plain text; SFTP (SSH FTP) is more secure.';
    }
    return buildFallbackExplanation(question, module, isCorrect);
  }

  return buildFallbackExplanation(question, module, isCorrect);
}

// ===== MAIN RENDER DISPATCHER =====
function render() {
  var el = document.getElementById('app');
  switch (S.view) {
    case 'dashboard': el.innerHTML = renderDashboard(); break;
    case 'course': el.innerHTML = renderCourse(); break;
    case 'reading': el.innerHTML = renderReading(); break;
    case 'module': el.innerHTML = renderModule(); break;
    case 'flashcards': el.innerHTML = renderFlashcards(); break;
    case 'quiz': el.innerHTML = renderQuiz(); break;
    case 'quiz-results': el.innerHTML = renderResults(); break;
    case 'add-course': el.innerHTML = renderAddCourse(); break;
    default: el.innerHTML = renderDashboard();
  }
}

// ===== DASHBOARD VIEW =====
function renderDashboard() {
  var totalFc = 0, totalQ = 0, cardsHtml = '';
  for (var i = 0; i < courses.length; i++) {
    var ms = courses[i].modules || [];
    for (var j = 0; j < ms.length; j++) {
      totalFc += (ms[j].flashcards || []).length;
      totalQ += (ms[j].questions || []).length;
    }
  }
  for (var i = 0; i < courses.length; i++) {
    var c = courses[i], fc = 0, qc = 0, ms = c.modules || [];
    for (var j = 0; j < ms.length; j++) {
      fc += (ms[j].flashcards || []).length;
      qc += (ms[j].questions || []).length;
    }
    cardsHtml +=
      '<div class="card card-clickable course-card fade-in" style="animation-delay:' + (i * 80) + 'ms;border-left:4px solid ' + c.color + '" onclick="nav(\'course\',{cid:\'' + c.id + '\'})">' +
      '<div class="course-header">' +
      '<div class="badge" style="background:' + c.color + '22;color:' + c.color + '">' + ms.length + ' module' + (ms.length !== 1 ? 's' : '') + '</div>' +
      '<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();confirmDeleteCourse(\'' + c.id + '\')">' + ICO.trash + '</button>' +
      '</div>' +
      '<h3 class="course-title">' + escapeHtml(c.title) + '</h3>' +
      '<p class="course-desc">' + escapeHtml(c.desc) + '</p>' +
      '<div class="course-meta">' +
      '<span>' + ICO.clone + ' ' + fc + ' flashcards</span>' +
      '<span>' + ICO.question + ' ' + qc + ' questions</span>' +
      '</div></div>';
  }
  var emptyHtml = courses.length === 0
    ? '<div class="card empty-state">' + ICO.book + '<p>No courses yet. Add your first course to get started.</p></div>'
    : '';

  return '<div class="fade-in">' +
    '<div class="flex flex-wrap items-end justify-between gap-lg mb-8">' +
    '<div><h1 class="font-display" style="font-size:2.2rem;font-weight:700;margin-bottom:6px">Dashboard</h1>' +
    '<p class="text-secondary" style="font-size:1rem">Your study materials at a glance</p></div>' +
    '<button class="btn btn-primary" onclick="nav(\'add-course\')">' + ICO.plus + ' Add Course</button></div>' +

    '<div class="stats-grid">' +
    '<div class="card stat-card" style="border-left:4px solid var(--accent)"><div class="stat-number" style="color:var(--accent)">' + courses.length + '</div><div class="stat-label">Courses</div></div>' +
    '<div class="card stat-card" style="border-left:4px solid var(--gold)"><div class="stat-number" style="color:var(--gold)">' + totalFc + '</div><div class="stat-label">Flashcards</div></div>' +
    '<div class="card stat-card" style="border-left:4px solid var(--error)"><div class="stat-number" style="color:var(--error)">' + totalQ + '</div><div class="stat-label">Questions</div></div></div>' +

    emptyHtml +
    '<div class="course-grid">' + cardsHtml + '</div></div>';
}

// ===== COURSE VIEW =====
function renderCourse() {
  var c = getCourse(S.cid);
  if (!c) return '<p>Course not found.</p>';
  var ms = c.modules || [], html = '';
  for (var i = 0; i < ms.length; i++) {
    var m = ms[i], p = getProgress(c.id, m.id);
    var scoreBadge = p.attempts > 0
      ? '<span class="badge" style="background:rgba(6,214,160,.12);color:var(--accent)">Best: ' + p.bestScore + '%</span>'
      : '';
    html +=
      '<div class="card card-clickable module-item fade-in" style="animation-delay:' + (i * 60) + 'ms;border-left:4px solid ' + c.color + '" onclick="nav(\'module\',{cid:\'' + c.id + '\',mid:\'' + m.id + '\'})">' +
      '<div class="module-inner"><div class="module-info">' +
      '<div class="module-top"><span class="module-num">0' + (i + 1) + '</span>' +
      '<h3 class="module-title">' + escapeHtml(m.title) + '</h3>' + scoreBadge + '</div>' +
      '<div class="module-meta">' +
      '<span>' + ICO.clone + ' ' + (m.flashcards || []).length + ' cards</span>' +
      '<span>' + ICO.question + ' ' + (m.questions || []).length + ' questions</span></div></div>' +
      '<button class="btn btn-danger btn-sm ml-auto" onclick="event.stopPropagation();confirmDeleteModule(\'' + c.id + '\',\'' + m.id + '\')">' + ICO.trash + '</button></div></div>';
  }
  var emptyHtml = ms.length === 0
    ? '<div class="card empty-state">' + ICO.puzzle + '<p>No modules yet. Add a module to start building content.</p></div>'
    : '';

  return '<div class="fade-in">' +
    '<nav class="breadcrumb"><a onclick="nav(\'dashboard\')">Dashboard</a><span class="sep">' + ICO.chevR + '</span><span class="current">' + escapeHtml(c.title) + '</span></nav>' +
    '<div class="flex flex-wrap items-end justify-between gap-lg mb-8">' +
    '<div><h1 class="font-display" style="font-size:1.8rem;font-weight:700;margin-bottom:6px">' + escapeHtml(c.title) + '</h1>' +
    '<p class="text-secondary" style="font-size:0.95rem">' + escapeHtml(c.desc) + '</p></div>' +
    '<div class="flex gap-md">' +
    '<button class="btn btn-secondary" onclick="nav(\'reading\',{cid:\'' + c.id + '\'})">' + ICO.book + ' Study Guide</button>' +
    '<button class="btn btn-secondary" onclick="showAddModuleModal(\'' + c.id + '\')">' + ICO.plus + ' Add Module</button></div></div>' +
    emptyHtml +
    '<div class="module-list">' + html + '</div></div>';
}

// ===== MODULE VIEW =====
function renderModule() {
  var c = getCourse(S.cid);
  if (!c) return '<p>Course not found.</p>';
  var m = getModule(c, S.mid);
  if (!m) return '<p>Module not found.</p>';
  var p = getProgress(c.id, m.id);
  var fcs = m.flashcards || [], qs = m.questions || [];
  var canQuiz = qs.length >= 1, canFlash = fcs.length >= 1;
  var bestHtml = p.attempts > 0
    ? '<div class="badge mt-4" style="background:rgba(255,209,102,.12);color:var(--gold)">Best: ' + p.bestScore + '% (' + p.attempts + ' attempt' + (p.attempts !== 1 ? 's' : '') + ')</div>'
    : '';

  var fcListHtml = '', qListHtml = '';
  for (var i = 0; i < fcs.length; i++) {
    fcListHtml +=
      '<div class="card content-item fade-in" style="animation-delay:' + (i * 35) + 'ms">' +
      '<div class="content-text"><div class="content-title">' + escapeHtml(fcs[i].front) + '</div>' +
      '<div class="content-sub">' + escapeHtml(fcs[i].back) + '</div></div>' +
      '<button class="btn btn-danger btn-sm" onclick="deleteFlashcard(\'' + c.id + '\',\'' + m.id + '\',' + i + ')">' + ICO.xmark + '</button></div>';
  }
  for (var i = 0; i < qs.length; i++) {
    var q = qs[i], ansText = '';
    if (q.type === 'multiple-choice' && q.options) {
      ansText = 'Answer: ' + escapeHtml(q.options[q.answer]);
    } else if (q.type === 'true-false') {
      ansText = 'Answer: ' + (q.answer ? 'True' : 'False');
    } else {
      ansText = 'Answer: ' + escapeHtml(q.answer);
    }
    var expl = buildQuestionExplanation(q, m, null, true).replace(/^Why:\s*/i, '').replace(/^Because:\s*/i, '');
    qListHtml +=
      '<div class="card content-item fade-in" style="animation-delay:' + (i * 35) + 'ms;padding:20px">' +
      '<div class="content-text" style="width:100%">' +
      '<div class="flex items-center gap-sm mb-2"><span class="badge" style="background:' + typeColor(q.type) + '22;color:' + typeColor(q.type) + '">' + typeLabel(q.type) + '</span></div>' +
      '<div class="content-title" style="margin-bottom:12px">' + escapeHtml(q.question) + '</div>' +
      '<div class="content-sub" style="color:var(--accent);font-weight:500;margin-bottom:10px">' + ansText + '</div>' +
      '<div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.5;padding:12px;background:rgba(136,146,164,.06);border-radius:8px;border-left:3px solid var(--accent)">' + escapeHtml(expl) + '</div></div>' +
      '<button class="btn btn-danger btn-sm" onclick="deleteQuestion(\'' + c.id + '\',\'' + m.id + '\',' + i + ')">' + ICO.xmark + '</button></div>';
  }
  var noContent = fcs.length === 0 && qs.length === 0
    ? '<div class="card empty-state">' + ICO.puzzle + '<p>No content yet. Add flashcards and questions above.</p></div>'
    : '';

  return '<div class="fade-in">' +
    '<nav class="breadcrumb"><a onclick="nav(\'dashboard\')">Dashboard</a><span class="sep">' + ICO.chevR + '</span>' +
    '<a onclick="nav(\'course\',{cid:\'' + c.id + '\'})">' + escapeHtml(c.title) + '</a><span class="sep">' + ICO.chevR + '</span>' +
    '<span class="current">' + escapeHtml(m.title) + '</span></nav>' +
    '<h1 class="font-display" style="font-size:1.8rem;font-weight:700;margin-bottom:32px">' + escapeHtml(m.title) + '</h1>' +

    '<div class="study-options">' +
    '<div class="card card-clickable study-option ' + (canFlash ? '' : 'pointer-events-none" style="opacity:0.35') + '" style="border-top-color:var(--accent)" onclick="' + (canFlash ? "showFlashcardSessionModal('" + c.id + "','" + m.id + "')" : '') + '">' +
    '<div class="study-icon" style="color:var(--accent)">' + ICO.clone + '</div>' +
    '<div class="study-title">Flashcards</div><div class="study-count">' + fcs.length + ' card' + (fcs.length !== 1 ? 's' : '') + ' to review</div></div>' +

    '<div class="card card-clickable study-option ' + (canQuiz ? '' : 'pointer-events-none" style="opacity:0.35') + '" style="border-top-color:var(--gold)" onclick="' + (canQuiz ? "showQuizSessionModal('" + c.id + "','" + m.id + "')" : '') + '">' +
    '<div class="study-icon" style="color:var(--gold)">' + ICO.question + '</div>' +
    '<div class="study-title">Take Quiz</div><div class="study-count">' + qs.length + ' question' + (qs.length !== 1 ? 's' : '') + ' to answer</div>' + bestHtml + '</div></div>' +

    '<div class="flex flex-wrap gap-md mb-8">' +
    '<button class="btn btn-secondary" onclick="showAddFlashcardModal(\'' + c.id + '\',\'' + m.id + '\')">' + ICO.plus + ' Add Flashcard</button>' +
    '<button class="btn btn-secondary" onclick="showAddQuestionModal(\'' + c.id + '\',\'' + m.id + '\')">' + ICO.plus + ' Add Question</button></div>' +

    (fcs.length > 0 ? '<div class="section-gap"><div class="section-header">Flashcards (' + fcs.length + ')</div><div class="content-grid">' + fcListHtml + '</div></div>' : '') +
    (qs.length > 0 ? '<div class="section-gap"><div class="section-header">Questions (' + qs.length + ')</div><div class="content-list-vertical">' + qListHtml + '</div></div>' : '') +
    noContent + '</div>';
}

// ===== FLASHCARDS VIEW =====
function showFlashcardSessionModal(cid, mid) {
  var c = getCourse(cid), m = getModule(c, mid);
  if (!m || !(m.flashcards || []).length) return;
  var total = m.flashcards.length;
  var maxOptions = [];
  var opts = [5, 10, 15, 20, total];
  for (var i = 0; i < opts.length; i++) {
    if (opts[i] <= total && (maxOptions.length === 0 || opts[i] !== maxOptions[maxOptions.length - 1])) {
      maxOptions.push(opts[i]);
    }
  }
  var optionsHtml = '';
  for (var i = 0; i < maxOptions.length; i++) {
    optionsHtml += '<button class="btn btn-secondary" style="width:100%;text-align:center;margin-bottom:8px" onclick="startFlashcards(\'' + cid + '\',\'' + mid + '\',' + maxOptions[i] + ')">' + maxOptions[i] + ' Cards</button>';
  }
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Study Session</h3>' +
    '<p class="text-secondary mb-6">How many flashcards would you like to study? (Total: ' + total + ')</p>' +
    '<div class="content-list-vertical">' + optionsHtml + '</div>');
}

function startFlashcards(cid, mid, sessionCount) {
  hideModal();
  var c = getCourse(cid), m = getModule(c, mid);
  if (!m || !(m.flashcards || []).length) return;
  var allCards = shuffle(m.flashcards);
  var cardsToStudy = sessionCount ? allCards.slice(0, Math.min(sessionCount, allCards.length)) : allCards;
  var p = getProgress(cid, mid), kn = p.fcKnown || [], ks = new Set();
  for (var i = 0; i < kn.length; i++) ks.add(kn[i]);
  S.fc = { idx: 0, flip: false, known: ks, cards: cardsToStudy };
  S.cid = cid; S.mid = mid;
  nav('flashcards', { cid: cid, mid: mid, score: 0, correct: 0, total: 0 });
}

function renderFlashcards() {
  var cards = S.fc.cards;
  if (!cards || !cards.length) return '<p>No flashcards.</p>';
  var idx = S.fc.idx, flip = S.fc.flip, known = S.fc.known;
  var card = cards[idx], pct = Math.round((known.size / cards.length) * 100);
  var allDone = known.size === cards.length;

  return '<div class="fade-in" style="max-width:720px;margin:0 auto">' +
    '<nav class="breadcrumb"><a onclick="nav(\'module\',{cid:\'' + S.cid + '\',mid:\'' + S.mid + '\'})">Back to Module</a></nav>' +
    '<div class="flex items-center justify-between mb-4">' +
    '<span class="text-sm font-semibold text-secondary">Card ' + (idx + 1) + ' of ' + cards.length + '</span>' +
    '<div class="flex items-center gap-md">' +
    '<button class="btn btn-secondary btn-sm" onclick="shuffleFlashcards()" title="Shuffle cards">' + ICO.shuffle + '</button>' +
    '<span class="text-sm" style="color:var(--accent)">' + known.size + '/' + cards.length + ' known</span></div></div>' +
    '<div class="progress-bar mb-10"><div class="progress-bar-fill" style="width:' + pct + '%;background:var(--accent)"></div></div>' +

    '<div class="flashcard-container' + (flip ? ' flipped' : '') + '" onclick="flipCard()"><div class="flashcard-inner">' +
    '<div class="flashcard-face flashcard-front"><div class="flashcard-label text-muted">QUESTION</div>' +
    '<div class="flashcard-text">' + escapeHtml(card.front) + '</div>' +
    '<div class="flashcard-hint">' + ICO.hand + ' Click to reveal answer</div></div>' +
    '<div class="flashcard-face flashcard-back"><div class="flashcard-label" style="color:var(--accent)">ANSWER</div>' +
    '<div style="font-size:1.15rem;line-height:1.6">' + escapeHtml(card.back) + '</div></div>' +
    '</div></div>' +

    '<div class="flashcard-controls">' +
    '<button class="btn btn-secondary" onclick="fcPrev()" ' + (idx === 0 ? 'disabled style="opacity:.3;pointer-events:none"' : '') + '>' + ICO.arrowL + '</button>' +
    (flip
      ? '<button class="btn btn-secondary" onclick="fcMark(false)" style="border-color:rgba(255,209,102,.3);color:var(--gold)">' + ICO.rotate + ' Still Learning</button>' +
        '<button class="btn btn-primary" onclick="fcMark(true)">' + ICO.check + ' Got It</button>'
      : '<span class="text-sm text-muted" style="padding:0 16px">Flip the card to rate it</span>') +
    '<button class="btn btn-secondary" onclick="fcNext()" ' + (idx === cards.length - 1 ? 'disabled style="opacity:.3;pointer-events:none"' : '') + '>' + ICO.arrowR + '</button></div>' +

    (allDone ? '<div class="card mt-10" style="padding:40px;text-align:center;border-color:rgba(6,214,160,.3);background:rgba(6,214,160,.04)">' +
      '<div style="color:var(--gold);font-size:2.5rem;margin-bottom:16px">' + ICO.trophy + '</div>' +
      '<p class="font-display" style="font-size:1.3rem;font-weight:700">All cards reviewed!</p>' +
      '<p class="text-secondary mt-2">You marked all ' + cards.length + ' cards as known.</p></div>' : '') +
    '</div>';
}

function flipCard() { S.fc.flip = !S.fc.flip; render(); }
function shuffleFlashcards() { S.fc.cards = shuffle(S.fc.cards); S.fc.idx = 0; S.fc.flip = false; toast('Cards shuffled', 'info'); render(); }

function shuffleQuestions() {
  var remaining = S.qz.qs.slice(S.qz.idx);
  var shuffled = shuffle(remaining);
  S.qz.qs = S.qz.qs.slice(0, S.qz.idx).concat(shuffled);
  toast('Remaining questions shuffled', 'info');
  render();
}
function fcPrev() { if (S.fc.idx > 0) { S.fc.idx--; S.fc.flip = false; render(); } }
function fcNext() { if (S.fc.idx < S.fc.cards.length - 1) { S.fc.idx++; S.fc.flip = false; render(); } }
function fcMark(ok) {
  if (ok) S.fc.known.add(S.fc.idx); else S.fc.known.delete(S.fc.idx);
  setProgress(S.cid, S.mid, { fcKnown: Array.from(S.fc.known) });
  if (S.fc.idx < S.fc.cards.length - 1) { S.fc.idx++; S.fc.flip = false; }
  else S.fc.flip = false;
  render();
}

// ===== QUIZ VIEW =====
function showQuizSessionModal(cid, mid) {
  var c = getCourse(cid), m = getModule(c, mid);
  if (!m || !(m.questions || []).length) return;
  var total = m.questions.length;
  var maxOptions = [];
  var opts = [5, 10, 15, 20, total];
  for (var i = 0; i < opts.length; i++) {
    if (opts[i] <= total && (maxOptions.length === 0 || opts[i] !== maxOptions[maxOptions.length - 1])) {
      maxOptions.push(opts[i]);
    }
  }
  var optionsHtml = '';
  for (var i = 0; i < maxOptions.length; i++) {
    optionsHtml += '<button class="btn btn-secondary" style="width:100%;text-align:center;margin-bottom:8px" onclick="startQuiz(\'' + cid + '\',\'' + mid + '\',' + maxOptions[i] + ')">' + maxOptions[i] + ' Questions</button>';
  }
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Quiz Session</h3>' +
    '<p class="text-secondary mb-6">How many questions would you like to answer? (Total: ' + total + ')</p>' +
    '<div class="content-list-vertical">' + optionsHtml + '</div>');
}

function startQuiz(cid, mid, sessionCount) {
  hideModal();
  var c = getCourse(cid), m = getModule(c, mid);
  if (!m || !(m.questions || []).length) return;
  var allQuestions = shuffle(m.questions);
  var questionsToUse = sessionCount ? allQuestions.slice(0, Math.min(sessionCount, allQuestions.length)) : allQuestions;
  var qs = questionsToUse.map(function (q) {
    var questionData = { type: q.type, question: q.question, options: q.options, answer: q.answer, explanation: buildQuestionExplanation(q, m) };
    if (q.type === 'multiple-choice') {
      var correctAns = q.options[q.answer], shuffled = shuffle(q.options);
      return { type: q.type, question: q.question, options: shuffled, answer: shuffled.indexOf(correctAns), explanation: buildQuestionExplanation(q, m) };
    }
    return questionData;
  });
  S.qz = { idx: 0, ans: new Array(qs.length).fill(null), qs: qs, done: false, sel: null, txt: '' };
  S.cid = cid; S.mid = mid;
  nav('quiz', { cid: cid, mid: mid, score: 0, correct: 0, total: 0 });
}

function renderQuiz() {
  var qs = S.qz.qs;
  if (!qs || !qs.length) return '<p>No questions.</p>';
  var idx = S.qz.idx, ans = S.qz.ans, done = S.qz.done, sel = S.qz.sel;
  var q = qs[idx], ua = ans[idx], isOk = done && checkAnswer(q, ua);
  var module = S.mid ? getModule(getCourse(S.cid), S.mid) : null;
  var explanationText = buildQuestionExplanation(q, module, ua, isOk).replace(/^Why:\s*/i, '').replace(/^Because:\s*/i, '');
  var explanationLabel = 'Key concept:';
  var pct = Math.round((idx / qs.length) * 100);

  var questionDisplay = escapeHtml(q.question);
  if (q.type === 'fill-blank') {
    questionDisplay = q.question.replace(/_{2,}/g, '<span style="border-bottom:2px dashed var(--accent);padding:0 12px;color:var(--accent);font-weight:600">______</span>');
  }

  var answerArea = '';
  if (q.type === 'multiple-choice') {
    var opts = q.options || [];
    for (var i = 0; i < opts.length; i++) {
      var cls = 'quiz-option';
      if (done) { cls += ' locked'; if (i === q.answer) cls += ' correct'; else if (i === sel && !isOk) cls += ' incorrect'; }
      else if (sel === i) cls += ' selected';
      answerArea += '<div class="' + cls + '" onclick="' + (done ? '' : 'selectOption(' + i + ')') + '" tabindex="0">' +
        '<span class="option-letter">' + String.fromCharCode(65 + i) + '</span><span>' + escapeHtml(opts[i]) + '</span></div>';
    }
  } else if (q.type === 'true-false') {
    var vals = [{ v: true, l: 'True', ico: ICO.tfTrue }, { v: false, l: 'False', ico: ICO.tfFalse }];
    for (var j = 0; j < vals.length; j++) {
      var vv = vals[j], cls = 'quiz-option';
      if (done) { cls += ' locked'; if (vv.v === q.answer) cls += ' correct'; else if (vv.v === sel && !isOk) cls += ' incorrect'; }
      else if (sel === vv.v) cls += ' selected';
      answerArea += '<div class="' + cls + '" style="flex:1;justify-content:center;font-size:1.1rem;font-weight:600" onclick="' + (done ? '' : 'selectOption(' + vv.v + ')') + '" tabindex="0">' + vv.ico + ' ' + vv.l + '</div>';
    }
  } else {
    var val = done ? (ua || '') : '';
    answerArea = '<input type="text" class="input" style="font-size:1.1rem" id="quiz-input" placeholder="Type your answer..." value="' + escapeHtml(val) + '" ' + (done ? 'disabled' : '') + ' oninput="onQuizInput()" onkeydown="if(event.key===\'Enter\'&&!' + done + ')submitAnswer()">';
    if (done && !isOk) {
      answerArea += '<div class="mt-4" style="padding:16px 20px;border-radius:12px;background:rgba(6,214,160,.08);color:var(--accent);border:1px solid rgba(6,214,160,.15);font-size:0.9rem">' + ICO.check + ' Correct answer: <strong>' + escapeHtml(q.answer) + '</strong></div>';
    }
  }

  var buttonHtml = '';
  if (!done) {
    var canSubmit = q.type === 'multiple-choice' ? sel !== null : q.type === 'true-false' ? sel !== null : true;
    buttonHtml = '<button class="btn btn-primary" id="submit-btn" onclick="submitAnswer()" ' + (canSubmit ? '' : 'style="opacity:.4;pointer-events:none"') + '>Submit Answer</button>';
  } else {
    var label = idx < qs.length - 1 ? 'Next Question' : 'See Results';
    buttonHtml = '<button class="btn btn-primary" style="width:100%;justify-content:center;display:flex" onclick="' + (idx < qs.length - 1 ? 'nextQuestion()' : 'finishQuiz()') + '">' + label + ' ' + ICO.arrowR + '</button>';
  }

  var feedbackHtml = done
    ? '<div class="quiz-feedback ' + (isOk ? 'correct' : 'incorrect') + '">' + (isOk ? ICO.okCirc : ICO.noCirc) + ' ' + (isOk ? 'Correct!' : 'Incorrect') + '</div>' +
      '<div class="review-explanation" style="margin-top:12px;padding:16px 18px;border-radius:12px;background:rgba(136,146,164,.06);border:1px solid rgba(136,146,164,.16);color:var(--text);line-height:1.6">' + escapeHtml(explanationLabel + ' ' + explanationText) + '</div>' +
      (done ? '<div class="quiz-actions" style="margin-top:12px;width:100%;justify-content:center;display:flex">' + buttonHtml + '</div>' : '')
    : '<div class="quiz-actions">' + buttonHtml + '</div>';

  return '<div class="fade-in" style="max-width:720px;margin:0 auto">' +
    '<nav class="breadcrumb"><a onclick="confirmExitQuiz()">' + ICO.exit + ' Back to Module</a></nav>' +
    '<div class="flex items-center justify-between mb-4">' +
    '<span class="text-sm font-semibold text-secondary">Question ' + (idx + 1) + ' of ' + qs.length + '</span>' +
    '<div class="flex items-center gap-md">' +
    '<button class="btn btn-secondary btn-sm" onclick="shuffleQuestions()" title="Shuffle remaining questions" ' + (done ? 'style="opacity:.3;pointer-events:none"' : '') + '>' + ICO.shuffle + '</button>' +
    '<span class="badge" style="background:' + typeColor(q.type) + '22;color:' + typeColor(q.type) + '">' + typeLabel(q.type) + '</span></div></div>' +
    '<div class="progress-bar mb-10"><div class="progress-bar-fill" style="width:' + pct + '%;background:var(--gold)"></div></div>' +
    '<h2 class="font-display" style="font-size:1.35rem;font-weight:700;margin-bottom:28px;line-height:1.5">' + questionDisplay + '</h2>' +
    '<div class="content-list-vertical mb-10">' + answerArea + '</div>' +
    feedbackHtml + '</div>';
}

function selectOption(v) { S.qz.sel = v; render(); var inp = document.getElementById('quiz-input'); if (inp) inp.focus(); }
function onQuizInput() {
  var inp = document.getElementById('quiz-input'); if (!inp) return;
  var btn = document.getElementById('submit-btn');
  if (btn) { if (inp.value.trim()) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; } else { btn.style.opacity = '.4'; btn.style.pointerEvents = 'none'; } }
}
function submitAnswer() {
  var qs = S.qz.qs, idx = S.qz.idx, sel = S.qz.sel, q = qs[idx], a = sel;
  if (q.type === 'identification' || q.type === 'fill-blank') {
    var inp = document.getElementById('quiz-input'); a = inp ? inp.value.trim() : ''; if (!a) return;
  }
  if (a === null || a === undefined) return;
  S.qz.ans[idx] = a; S.qz.done = true; S.qz.txt = ''; render();
}
function nextQuestion() { S.qz.idx++; S.qz.done = false; S.qz.sel = null; S.qz.txt = ''; render(); var inp = document.getElementById('quiz-input'); if (inp) inp.focus(); }
function finishQuiz() {
  var qs = S.qz.qs, ans = S.qz.ans, c = 0;
  for (var i = 0; i < qs.length; i++) if (checkAnswer(qs[i], ans[i])) c++;
  var score = Math.round((c / qs.length) * 100), p = getProgress(S.cid, S.mid);
  setProgress(S.cid, S.mid, { bestScore: Math.max(p.bestScore || 0, score), attempts: (p.attempts || 0) + 1 });
  S.score = score; S.correct = c; S.total = qs.length;
  nav('quiz-results', { cid: S.cid, mid: S.mid, score: score, correct: c, total: qs.length });
}
function confirmExitQuiz() {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Exit Quiz?</h3><p class="text-secondary mb-6">Your progress on this attempt will be lost.</p>' +
    '<div class="flex gap-md"><button class="btn btn-danger" onclick="hideModal();nav(\'module\',{cid:\'' + S.cid + '\',mid:\'' + S.mid + '\'})">' + ICO.exit + ' Exit</button><button class="btn btn-secondary" onclick="hideModal()">Continue Quiz</button></div>');
}

// ===== RESULTS VIEW =====
function renderResults() {
  var score = S.score, correct = S.correct, total = S.total;
  var qs = S.qz.qs, ans = S.qz.ans;
  var module = S.mid ? getModule(getCourse(S.cid), S.mid) : null;
  var circ = 2 * Math.PI * 42, off = circ - (score / 100) * circ;
  var clr = score >= 80 ? 'var(--accent)' : score >= 50 ? 'var(--gold)' : 'var(--error)';
  var msg = score >= 80 ? 'Excellent work!' : score >= 50 ? 'Good effort, keep studying!' : 'Keep practicing, you will get there!';

  var reviewHtml = '';
  for (var i = 0; i < qs.length; i++) {
    var q = qs[i], ua = ans[i], ok = checkAnswer(q, ua);
    var userDisplay = 'No answer', correctDisplay = String(q.answer);
    if (q.type === 'multiple-choice') { userDisplay = ua !== null && q.options ? q.options[ua] : 'No answer'; correctDisplay = q.options ? q.options[q.answer] : correctDisplay; }
    else if (q.type === 'true-false') { userDisplay = ua === true ? 'True' : ua === false ? 'False' : 'No answer'; correctDisplay = q.answer ? 'True' : 'False'; }
    else userDisplay = ua || 'No answer';

    var explanation = buildQuestionExplanation(q, module, ua, ok).replace(/^Why:\s*/i, '').replace(/^Because:\s*/i, '');

    reviewHtml +=
      '<div class="card review-item" style="border-left:4px solid ' + (ok ? 'var(--accent)' : 'var(--error)') + '">' +
      '<div class="review-inner">' + (ok ? ICO.okCirc : ICO.noCirc) +
      '<div class="review-body"><div class="flex items-center gap-sm mb-2"><span class="badge" style="background:' + typeColor(q.type) + '22;color:' + typeColor(q.type) + '">' + typeLabel(q.type) + '</span></div>' +
      '<p class="text-sm font-semibold" style="margin-bottom:8px">' + escapeHtml(q.question) + '</p>' +
      '<p class="your-answer" style="color:' + (ok ? 'var(--accent)' : 'var(--error)') + '">Your answer: ' + escapeHtml(String(userDisplay)) + '</p>' +
      (!ok ? '<p class="correct-answer">Correct: ' + escapeHtml(correctDisplay) + '</p>' : '') +
      '<p class="review-explanation">' + escapeHtml(explanation) + '</p>' +
      '</div></div></div>';
  }

  return '<div class="fade-in" style="max-width:720px;margin:0 auto">' +
    '<div style="text-align:center;margin-bottom:48px">' +
    '<svg width="160" height="160" viewBox="0 0 100 100" style="margin:0 auto 24px;display:block">' +
    '<circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" stroke-width="7"/>' +
    '<circle cx="50" cy="50" r="42" fill="none" stroke="' + clr + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + off + '" transform="rotate(-90 50 50)" class="progress-ring-circle"/>' +
    '<text x="50" y="47" text-anchor="middle" fill="var(--text)" font-family="Space Grotesk,sans-serif" font-size="22" font-weight="700">' + score + '%</text>' +
    '<text x="50" y="64" text-anchor="middle" fill="var(--text-secondary)" font-family="DM Sans,sans-serif" font-size="9">' + correct + '/' + total + ' correct</text></svg>' +
    '<h2 class="font-display" style="font-size:1.6rem;font-weight:700;margin-bottom:8px">' + msg + '</h2>' +
    '<p class="text-secondary">You answered ' + correct + ' out of ' + total + ' questions correctly</p></div>' +
    '<div class="flex flex-wrap justify-center gap-md mb-10">' +
    '<button class="btn btn-primary" onclick="startQuiz(\'' + S.cid + '\',\'' + S.mid + '\')">' + ICO.rotate + ' Retry Quiz</button>' +
    '<button class="btn btn-secondary" onclick="nav(\'module\',{cid:\'' + S.cid + '\',mid:\'' + S.mid + '\'})">' + ICO.arrowL + ' Back to Module</button>' +
    '<button class="btn btn-secondary" onclick="nav(\'dashboard\')">' + ICO.home + ' Back to Home</button></div>' +
    '<div class="section-header">Question Review</div><div class="content-list-vertical">' + reviewHtml + '</div></div>';
}

// ===== COMPREHENSIVE STUDY GUIDE (Textbook Style) =====
function renderReading() {
  var c = getCourse(S.cid);
  if (!c) return '<p>Course not found.</p>';
  
  var html = '<div class="fade-in" style="max-width:1000px;margin:0 auto">' +
    '<nav class="breadcrumb"><a onclick="nav(\'dashboard\')">Dashboard</a><span class="sep">' + ICO.chevR + '</span><a onclick="nav(\'course\',{cid:\'' + S.cid + '\'})">' + escapeHtml(c.title) + '</a><span class="sep">' + ICO.chevR + '</span><span class="current">Complete Study Guide</span></nav>' +
    '<div class="mb-8"><button class="btn btn-secondary" onclick="nav(\'course\',{cid:\'' + S.cid + '\'})">' + ICO.arrowL + ' Back to Course</button></div>' +
    '<h1 class="font-display" style="font-size:2rem;margin-bottom:8px">' + escapeHtml(c.title) + '</h1>' +
    '<p style="color:var(--text-secondary);margin-bottom:32px">Complete textbook-style guide with lessons, study materials, flashcards, and practice questions</p>';
  
  // Iterate through all modules
  (c.modules || []).forEach(function(m) {
    var mod = m;
    html += '<div class="card mb-8" style="border-left:4px solid var(--accent);padding:28px">' +
      '<h2 class="font-display" style="font-size:1.6rem;margin-bottom:20px;color:var(--accent)">' + escapeHtml(mod.title) + '</h2>';
    
    // MODULE OVERVIEW/LESSON SECTION
    var lessonBullets = '';
    var lessonCards = (mod.flashcards || []).slice(0, 4);
    if (lessonCards.length) {
      lessonBullets = '<ul style="margin:0;padding-left:22px;color:var(--text-secondary);line-height:1.8">' +
        lessonCards.map(function (card) {
          return '<li><strong style="color:var(--text)">' + escapeHtml(card.front) + '</strong> — ' + escapeHtml(card.back) + '</li>';
        }).join('') +
        '</ul>';
    } else {
      lessonBullets = '<p style="color:var(--text-secondary);line-height:1.6">Add a few flashcards to build the lesson summary for this module.</p>';
    }

    html += '<div style="background:rgba(6,214,160,0.05);padding:20px;border-radius:8px;margin-bottom:24px">' +
      '<h3 style="font-weight:700;margin-bottom:12px;color:var(--accent)">Lesson & Key Concepts</h3>' +
      '<p style="color:var(--text-secondary);line-height:1.6;margin-bottom:12px">' +
      'This module covers ' + escapeHtml(mod.title.toLowerCase()) + '. Review the lesson points below before testing yourself on the practice questions.' +
      '</p>' + lessonBullets + '</div>';
    
    // FLASHCARDS SECTION
    html += '<div style="margin-bottom:24px">' +
      '<h3 style="font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">' + ICO.puzzle + ' Study Flashcards (' + (mod.flashcards ? mod.flashcards.length : 0) + ')</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">';
    
    if (mod.flashcards && mod.flashcards.length > 0) {
      mod.flashcards.forEach(function(fc, idx) {
        html += '<div class="card" style="background:linear-gradient(135deg,rgba(6,214,160,0.1),rgba(255,193,7,0.05));padding:16px;min-height:120px;display:flex;flex-direction:column;justify-content:space-between">' +
          '<div><span style="font-size:0.85rem;color:var(--text-secondary);font-weight:600">Card ' + (idx+1) + '/' + mod.flashcards.length + '</span>' +
          '<p style="font-weight:600;margin:8px 0 12px;color:var(--text-primary)">' + escapeHtml(fc.front) + '</p></div>' +
          '<div style="border-top:1px solid var(--border-color);padding-top:12px"><strong style="color:var(--accent)">Answer:</strong> ' + escapeHtml(fc.back) + '</div></div>';
      });
    }
    
    html += '</div></div>';
    
    // QUIZ QUESTIONS SECTION
    html += '<div>' +
      '<h3 style="font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">' + ICO.question + ' Practice Questions (' + (mod.questions ? mod.questions.length : 0) + ')</h3>' +
      '<div style="display:flex;flex-direction:column;gap:16px">';
    
    if (mod.questions && mod.questions.length > 0) {
      mod.questions.forEach(function(q, qidx) {
        var qNum = qidx + 1;
        var qTypeLabel = '';
        if (q.type === 'multiple-choice') qTypeLabel = 'MC';
        else if (q.type === 'true-false') qTypeLabel = 'T/F';
        else if (q.type === 'identification') qTypeLabel = 'ID';
        else if (q.type === 'fill-blank') qTypeLabel = 'Fill-Blank';
        
        html += '<div class="card" style="padding:20px;background:rgba(0,0,0,0.02)">' +
          '<div style="display:flex;gap:12px;margin-bottom:12px">' +
          '<span style="background:var(--accent);color:white;padding:4px 10px;border-radius:4px;font-size:0.8rem;font-weight:700">' + qNum + '</span>' +
          '<span style="background:rgba(255,193,7,0.2);color:var(--text-primary);padding:4px 10px;border-radius:4px;font-size:0.8rem;font-weight:600">' + qTypeLabel + '</span></div>' +
          '<p style="font-weight:600;margin-bottom:12px;color:var(--text-primary)">' + escapeHtml(q.question) + '</p>';
        
        if (q.type === 'multiple-choice' && q.options) {
          html += '<div style="margin-left:16px;border-left:2px solid var(--accent-light)">';
          q.options.forEach(function(opt, oIdx) {
            var isAnswer = (oIdx === q.answer);
            var optStyle = isAnswer ? 'color:var(--accent);font-weight:600' : 'color:var(--text-secondary)';
            html += '<div style="padding:6px 0;' + optStyle + '">' + String.fromCharCode(65+oIdx) + ') ' + escapeHtml(opt) + (isAnswer ? ' ✓' : '') + '</div>';
          });
          html += '</div>';
        } else if (q.type === 'true-false') {
          var tfAnswer = q.answer ? 'True' : 'False';
          html += '<div style="margin-left:16px"><strong style="color:var(--accent)">Answer: ' + tfAnswer + '</strong></div>';
        } else if (q.type === 'identification' || q.type === 'fill-blank') {
          html += '<div style="margin-left:16px"><strong style="color:var(--accent)">Answer: ' + escapeHtml(q.answer) + '</strong></div>';
        }
        
        html += '</div>';
      });
    }
    
    html += '</div></div></div>';
  });
  
  html += '<div class="mt-8"><button class="btn btn-secondary" onclick="nav(\'course\',{cid:\'' + S.cid + '\'})">' + ICO.arrowL + ' Back to Course</button></div></div>';
  
  return html;
}

// ===== ADD COURSE VIEW =====
function renderAddCourse() {
  return '<div class="fade-in" style="max-width:600px;margin:0 auto">' +
    '<nav class="breadcrumb"><a onclick="nav(\'dashboard\')">Dashboard</a><span class="sep">' + ICO.chevR + '</span><span class="current">Add Course</span></nav>' +
    '<h1 class="font-display" style="font-size:1.8rem;font-weight:700;margin-bottom:32px">Create New Course</h1>' +
    '<div class="card" style="padding:36px">' +
    '<div class="mb-6"><label class="text-sm font-semibold mb-2" style="display:block">Course Title</label>' +
    '<input type="text" class="input" id="new-course-title" placeholder="e.g., CompTIA Security+"></div>' +
    '<div class="mb-8"><label class="text-sm font-semibold mb-2" style="display:block">Description</label>' +
    '<textarea class="input" id="new-course-desc" placeholder="Brief description of the course content..." rows="3"></textarea></div>' +
    '<div class="flex gap-md"><button class="btn btn-primary" onclick="createCourse()">' + ICO.plus + ' Create Course</button>' +
    '<button class="btn btn-secondary" onclick="nav(\'dashboard\')">Cancel</button></div></div></div>';
}

function createCourse() {
  var title = document.getElementById('new-course-title').value.trim();
  var desc = document.getElementById('new-course-desc').value.trim();
  if (!title) { toast('Please enter a course title', 'error'); return; }
  var colors = ['#06d6a0', '#ffd166', '#ef476f', '#118ab2', '#8338ec', '#ff6b6b', '#4ecdc4', '#f77f00'];
  courses.push({ id: genId(), title: title, desc: desc || 'No description provided.', color: colors[courses.length % colors.length], modules: [] });
  saveData(); toast('Course created!'); nav('dashboard');
}

// ===== MODAL FORMS: ADD MODULE =====
function showAddModuleModal(cid) {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:20px">Add Module</h3>' +
    '<div class="mb-6"><label class="text-sm font-semibold mb-2" style="display:block">Module Title</label>' +
    '<input type="text" class="input" id="new-mod-title" placeholder="e.g., Network Security Fundamentals"></div>' +
    '<div class="flex gap-md"><button class="btn btn-primary" onclick="addModule(\'' + cid + '\')">Add Module</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
  setTimeout(function () { var e = document.getElementById('new-mod-title'); if (e) e.focus(); }, 100);
}

function addModule(cid) {
  var title = document.getElementById('new-mod-title').value.trim();
  if (!title) { toast('Please enter a module title', 'error'); return; }
  var c = getCourse(cid); if (!c) return;
  c.modules.push({ id: genId(), title: title, flashcards: [], questions: [] });
  saveData(); hideModal(); toast('Module added!'); render();
}

// ===== MODAL FORMS: ADD FLASHCARD =====
function showAddFlashcardModal(cid, mid) {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:20px">Add Flashcard</h3>' +
    '<div class="mb-5"><label class="text-sm font-semibold mb-2" style="display:block">Front (Question / Term)</label>' +
    '<textarea class="input" id="fc-front" placeholder="What is OSPF?" rows="2"></textarea></div>' +
    '<div class="mb-6"><label class="text-sm font-semibold mb-2" style="display:block">Back (Answer / Definition)</label>' +
    '<textarea class="input" id="fc-back" placeholder="Open Shortest Path First \u2014 a link-state routing protocol..." rows="3"></textarea></div>' +
    '<div class="flex gap-md"><button class="btn btn-primary" onclick="addFlashcard(\'' + cid + '\',\'' + mid + '\')">Add Flashcard</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
  setTimeout(function () { var e = document.getElementById('fc-front'); if (e) e.focus(); }, 100);
}

function addFlashcard(cid, mid) {
  var front = document.getElementById('fc-front').value.trim();
  var back = document.getElementById('fc-back').value.trim();
  if (!front || !back) { toast('Please fill in both sides', 'error'); return; }
  var c = getCourse(cid), m = getModule(c, mid); if (!m) return;
  m.flashcards.push({ front: front, back: back });
  saveData(); hideModal(); toast('Flashcard added!'); render();
}

// ===== MODAL FORMS: ADD QUESTION =====
function showAddQuestionModal(cid, mid) {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:20px">Add Question</h3>' +
    '<div class="mb-5"><label class="text-sm font-semibold mb-2" style="display:block">Question Type</label>' +
    '<select class="input" id="q-type" onchange="updateQuestionFields()"><option value="multiple-choice">Multiple Choice</option><option value="identification">Identification</option><option value="true-false">True or False</option><option value="fill-blank">Fill in the Blank</option></select></div>' +
    '<div class="mb-5"><label class="text-sm font-semibold mb-2" style="display:block">Question</label>' +
    '<textarea class="input" id="q-text" placeholder="Enter your question..." rows="2"></textarea></div>' +
    '<div id="q-dynamic-fields"></div>' +
    '<div class="flex gap-md mt-6"><button class="btn btn-primary" onclick="addQuestion(\'' + cid + '\',\'' + mid + '\')">Add Question</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
  setTimeout(function () { updateQuestionFields(); var e = document.getElementById('q-text'); if (e) e.focus(); }, 100);
}

function updateQuestionFields() {
  var type = document.getElementById('q-type').value, el = document.getElementById('q-dynamic-fields');
  if (type === 'multiple-choice') {
    var html = '';
    for (var i = 0; i < 4; i++) html += '<div class="mb-4"><label class="text-xs font-semibold mb-2 text-secondary" style="display:block">Option ' + String.fromCharCode(65 + i) + '</label><input type="text" class="input" id="q-opt-' + i + '" placeholder="Option ' + String.fromCharCode(65 + i) + '"></div>';
    html += '<div class="mb-4"><label class="text-sm font-semibold mb-2" style="display:block">Correct Answer</label><select class="input" id="q-correct"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div>';
    el.innerHTML = html;
  } else if (type === 'true-false') {
    el.innerHTML = '<div class="mb-4"><label class="text-sm font-semibold mb-2" style="display:block">Correct Answer</label><select class="input" id="q-correct"><option value="true">True</option><option value="false">False</option></select></div>';
  } else if (type === 'fill-blank') {
    el.innerHTML = '<div class="mb-4" style="padding:14px 18px;border-radius:10px;background:var(--bg);border:1px solid var(--border);font-size:0.85rem;color:var(--text-secondary)">' + ICO.info + ' Use <strong>___</strong> (3+ underscores) in your question to mark the blank.</div>' +
      '<div class="mb-4"><label class="text-sm font-semibold mb-2" style="display:block">Answer (fills the blank)</label><input type="text" class="input" id="q-answer" placeholder="The correct answer"></div>';
  } else {
    el.innerHTML = '<div class="mb-4"><label class="text-sm font-semibold mb-2" style="display:block">Answer</label><input type="text" class="input" id="q-answer" placeholder="The correct answer"></div>';
  }
}

function addQuestion(cid, mid) {
  var type = document.getElementById('q-type').value;
  var question = document.getElementById('q-text').value.trim();
  if (!question) { toast('Please enter the question', 'error'); return; }
  var obj = { type: type, question: question };
  if (type === 'multiple-choice') {
    var opts = [], valid = true;
    for (var i = 0; i < 4; i++) { var v = document.getElementById('q-opt-' + i).value.trim(); if (!v) { valid = false; break; } opts.push(v); }
    if (!valid) { toast('Please fill in all 4 options', 'error'); return; }
    obj.options = opts; obj.answer = parseInt(document.getElementById('q-correct').value);
  } else if (type === 'true-false') {
    obj.answer = document.getElementById('q-correct').value === 'true';
  } else {
    var a = document.getElementById('q-answer').value.trim();
    if (!a) { toast('Please enter the answer', 'error'); return; }
    obj.answer = a;
  }
  var c = getCourse(cid), m = getModule(c, mid); if (!m) return;
  m.questions.push(obj); saveData(); hideModal(); toast('Question added!'); render();
}

// ===== DELETE ACTIONS =====
function confirmDeleteCourse(cid) {
  var c = getCourse(cid); if (!c) return;
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Delete Course?</h3>' +
    '<p class="text-secondary mb-6">Delete <strong>' + escapeHtml(c.title) + '</strong>? This cannot be undone.</p>' +
    '<div class="flex gap-md"><button class="btn btn-danger" onclick="deleteCourse(\'' + cid + '\')">' + ICO.trash + ' Delete</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
}
function deleteCourse(cid) {
  courses = courses.filter(function (c) { return c.id !== cid; });
  var keys = Object.keys(progress);
  for (var i = 0; i < keys.length; i++) if (keys[i].indexOf(cid + '_') === 0) delete progress[keys[i]];
  saveData(); hideModal(); toast('Course deleted', 'info'); nav('dashboard');
}

function confirmDeleteModule(cid, mid) {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Delete Module?</h3>' +
    '<p class="text-secondary mb-6">All flashcards and questions in this module will be lost.</p>' +
    '<div class="flex gap-md"><button class="btn btn-danger" onclick="deleteModule(\'' + cid + '\',\'' + mid + '\')">' + ICO.trash + ' Delete</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
}
function deleteModule(cid, mid) {
  var c = getCourse(cid); if (!c) return;
  c.modules = c.modules.filter(function (m) { return m.id !== mid; });
  delete progress[cid + '_' + mid]; saveData(); hideModal(); toast('Module deleted', 'info'); render();
}

function deleteFlashcard(cid, mid, idx) {
  var c = getCourse(cid), m = getModule(c, mid); if (!m) return;
  m.flashcards.splice(idx, 1); saveData(); toast('Flashcard removed', 'info'); render();
}

function deleteQuestion(cid, mid, idx) {
  var c = getCourse(cid), m = getModule(c, mid); if (!m) return;
  m.questions.splice(idx, 1); saveData(); toast('Question removed', 'info'); render();
}

// ===== RESET =====
function resetAll() {
  showModal('<h3 class="font-display" style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Reset All Data?</h3>' +
    '<p class="text-secondary mb-6">This deletes all your courses and progress, restoring the original CCNA 1 &amp; 2 content.</p>' +
    '<div class="flex gap-md"><button class="btn btn-danger" onclick="doReset()">' + ICO.trash + ' Reset Everything</button><button class="btn btn-secondary" onclick="hideModal()">Cancel</button></div>');
}
function doReset() {
  localStorage.removeItem('sf4c'); localStorage.removeItem('sf4p');
  hideModal(); loadData(); toast('Data reset to defaults', 'info'); nav('dashboard');
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function (e) {
  if (S.view === 'flashcards' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
    if (e.key === 'ArrowLeft') fcPrev();
    if (e.key === 'ArrowRight') fcNext();
  }
  if (S.view === 'quiz' && !S.qz.done && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    var q = S.qz.qs[S.qz.idx];
    if (q && q.type === 'multiple-choice' && e.key >= '1' && e.key <= '4') selectOption(parseInt(e.key) - 1);
    if (q && q.type === 'true-false') { if (e.key === 't' || e.key === 'T') selectOption(true); if (e.key === 'f' || e.key === 'F') selectOption(false); }
  }
});

// ===== INITIALIZATION =====
loadData();
render();