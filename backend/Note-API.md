# Note về các API có trong backend của trang web


## Chức năng IP scanning:

### 1. Lấy toàn bộ IP đã scan được trong database

**Endpoint:** `/api/ip/`

**Method:** `GET`

**Request:**

**Response:**

```
[
    {
        "id": "int",
        "ip_address": "string (ip address)",
        "mac_address": "string (mac address)",
        "vendor": "string (or unknown)",
        "device": "string (or unknown)",
        "os": "string (or unknown)",
        "open_ports": "string of ports (or No open ports)",
        "scan_date": "string of date",
        "is_active": "boolean (true or false)"
        "events": [
            {
                "id": "int",
                "event": "int",
                "ip_address": "string (ip address)",
                "event_date": "string of date",
                "is_active": "boolean (true or false)",
                "additional_info": "string"
            },
            ...
        ]
    }

    ...
]

```

Status code: 200

### 2. Tạo IP mới trong database:

**Endpoint:** `/api/ip/create`

**Method:** `POST`

**Request:** 
```
{
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string",
    "device": "string",
    "os": "string",
    "open_ports": "string of ports",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
}
```
**Response:** 

Status Code: 201

### 3. Chi tiết về IP chỉ định trong database:

**Endpoint:** `/api/ip/{id}`

**Method:** `GET`

**Request:** 

**Response:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string (or unknown)",
    "device": "string (or unknown)",
    "os": "string (or unknown)",
    "open_ports": "string of ports (or No open ports)",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
    "events": [
    {
        "id": "int",
        "event": "int",
        "ip_address": "string (ip address)",
        "event_date": "string of date",
        "is_active": "boolean (true or false)",
        "additional_info": "string"
    },
    ...
    ]
}

```

Status code: 200 

**Endpoint:** `/api/ip/{id}`

**Method:** `POST`

**Request:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string (or unknown)",
    "device": "string (or unknown)",
    "os": "string (or unknown)",
    "open_ports": "string of ports (or No open ports)",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
}

```

**Response:** 

Status code: 200


**Endpoint:** `/api/ip/{id}`

**Method:** `DELETE`

**Request:** 

**Response:** 

Status code: 204 

### 4. Thay đổi dãy địa chỉ IP cần quét

**Endpoint:** `/api/ip/changehost`

**Method:** `POST`


**Request:** 

```
{
    host: "string of network range (for example: "192.168.1.0/24")"
}
```

**Response:** 

Status code: 200

### 5. Thực hiện default scan (scan 1000 port nổi tiếng) với IP chỉ định

**Endpoint:** `/api/ip/{id}/defaultscan`

**Method:** `GET`


**Request:** 


**Response:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string (or unknown)",
    "device": "string (or unknown)",
    "os": "string (or unknown)",
    "open_ports": "string of ports (or No open ports)",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
    "events": [
    {
        "id": "int",
        "event": "int",
        "ip_address": "string (ip address)",
        "event_date": "string of date",
        "is_active": "boolean (true or false)",
        "additional_info": "string"
    },
    ...
    ]
}
```

### 6. Thực hiện fast scan (scan 100 port nổi tiếng) với IP chỉ định

**Endpoint:** `/api/ip/{id}/fastscan`

**Method:** `GET`


**Request:** 


**Response:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string (or unknown)",
    "device": "string (or unknown)",
    "os": "string (or unknown)",
    "open_ports": "string of ports (or No open ports)",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
    "events": [
    {
        "id": "int",
        "event": "int",
        "ip_address": "string (ip address)",
        "event_date": "string of date",
        "is_active": "boolean (true or false)",
        "additional_info": "string"
    },
    ...
    ]
}
```

### 7. Thực hiện full scan (scan toàn bộ 65535 port) với IP chỉ định

**Endpoint:** `/api/ip/{id}/fullscan`

**Method:** `GET`


**Request:** 


**Response:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "mac_address": "string (mac address)",
    "vendor": "string (or unknown)",
    "device": "string (or unknown)",
    "os": "string (or unknown)",
    "open_ports": "string of ports (or No open ports)",
    "scan_date": "string of date",
    "is_active": "boolean (true or false)"
    "events": [
    {
        "id": "int",
        "event": "int",
        "ip_address": "string (ip address)",
        "event_date": "string of date",
        "is_active": "boolean (true or false)",
        "additional_info": "string"
    },
    ...
    ]
}
```

### 8. Lấy toàn bộ events đối với IP chỉ định trong database

**Endpoint:** `/api/ip/{id}/events`

**Method:** `GET`


**Request:** 


**Response:** 

```
[
    {
        "id": "int",
        "event": "int",
        "ip_address": "string (ip address)",
        "event_date": "string of date",
        "is_active": "boolean (true or false)",
        "additional_info": "string"
    },
    ...
]

```



## Chức năng ICMP Monitoring:

### 1. Tiến hành ping IP được chỉ định và lưu vào database

**Endpoint:** `/api/icmp_scan/`

**Method:** `POST`

**Request:**

```
{
    "ip": "string (ip address)",
}
```

**Response:**

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "scan_date": "string of date",
    "is_active": "boolean (true of false),
    "max_rtt": "float (or 0 when fail)",
    "min_rtt": "float (or 0 when fail)",
    "avg_rtt": "float (or 0 when fail)"
}
```

Status code: 200

### 2. Liệt kê các IP đã ping bằng ICMP trong database:

**Endpoint:** `/api/icmp_list/`

**Method:** `GET`

**Request:** 

**Response:** 

```
[
    {
    "id": "int",
    "ip_address": "string (ip address)",
    "scan_date": "string of date",
    "is_active": "boolean (true of false),
    "max_rtt": "float (or 0 when fail)",
    "min_rtt": "float (or 0 when fail)",
    "avg_rtt": "float (or 0 when fail)"
    },
    ...
]


```
Status Code: 200

### 3. Chi tiết về IP chỉ định đã ping bằng ICMP trong database:

**Endpoint:** `/api/icmp_detail/{id}`

**Method:** `GET`

**Request:** 

**Response:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "scan_date": "string of date",
    "is_active": "boolean (true of false),
    "max_rtt": "float (or 0 when fail)",
    "min_rtt": "float (or 0 when fail)",
    "avg_rtt": "float (or 0 when fail)"
}
```

Status code: 200 

**Endpoint:** `/api/icmp_detail/{id}`

**Method:** `POST`

**Request:** 

```
{
    "id": "int",
    "ip_address": "string (ip address)",
    "scan_date": "string of date",
    "is_active": "boolean (true of false),
    "max_rtt": "float (or 0 when fail)",
    "min_rtt": "float (or 0 when fail)",
    "avg_rtt": "float (or 0 when fail)"
}

```

**Response:** 

Status code: 200


**Endpoint:** `/api/icmp_detail/{id}`

**Method:** `DELETE`

**Request:** 

**Response:** 

Status code: 204
