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

## 2. Internet Speedtest

### 2.1. Run speedtest and delete old speedtest

---

#### **Endpoint: `/api/speedtest/`**
   - **Methods:** `GET`, `DELETE`

---

#### **Method: GET**

**Description:**  
Runs a new speed test using the `run_speed_test` function and returns the download speed, upload speed, and ping.

**Request:**
- No request body or query parameters.

**Response:**
- **Success (200 OK):**
    ```json
    {
        "download_speed": 123.45,
        "upload_speed": 67.89,
        "ping": 12.34
    }
    ```
- **Failure (500 Internal Server Error):**
    ```json
    {
        "error": "Error message here"
    }
    ```

---

#### **Method: DELETE**

**Description:**  
Deletes speed test entries based on a specific `date` provided in the query parameter.

**Request:**
- Query Parameter:
    - `date`: Date in format `YYYY-MM-DDTHH:MM:SS.ssssssZ` (e.g., `2024-11-15T10:28:28.953333Z`).

**Response:**
- **Success (200 OK):**
    ```json
    {
        "message": "Speed tests deleted successfully."
    }
    ```

- **Failure (Edge cases, like invalid date - 4xx):**
    ```json
    {
        "error": "Invalid date format."
    }
    ```

---

### 2.2 Speedtest History

#### **Endpoint: `/api/speedtest-history/`**
   - **Method:** `GET`

---

#### **Method: GET**

**Description:**  
Fetches speed test records based on the `action` query parameter.

**Request:**
- Query Parameters:
    - `action` (required): Specifies the operation to perform. Accepted values are:
      - `brief`
      - `partial`
      - `all`
    - For **partial**:
        - `page` (int, optional): Page index (default: 1).
        - `entries` (int, optional): Number of entries per page (default: 10).
        - `sortby` (optional): Field to sort by. Accepted values:
            - `download_speed`
            - `upload_speed`
            - `ping`
            - `created_at`  
          Default: `created_at`.
        - `asc` (optional): Sorting order (`true` for ascending, `false` for descending). Default: `true`.
    - For **all**:
        - `sortby` and `asc` parameters as above.

**Responses:**

---

##### **Action: `brief`**

- **Description:** Returns aggregated statistics: maximum, minimum, and average download/upload speeds and ping.

**Response:**
```json
{
    "max_download_speed": 150.5,
    "min_download_speed": 20.1,
    "avg_download_speed": 85.3,
    "max_upload_speed": 80.5,
    "min_upload_speed": 10.2,
    "avg_upload_speed": 45.4,
    "max_ping": 20.3,
    "min_ping": 5.6,
    "avg_ping": 12.7
}
```

---

##### **Action: `partial`**

- **Description:** Returns paginated speed test records with sorting.

**Example Request:**  
`GET /api/speedtest-history/?action=partial&page=1&entries=2&sortby=download_speed&asc=false`

**Response:**
```json
{
    "from": 1,
    "to": 2,
    "total": 100,
    "results": [
        {
            "download_speed": 120.5,
            "upload_speed": 50.3,
            "ping": 12.2,
            "created_at": "2024-11-15T10:28:28.953333Z"
        },
        {
            "download_speed": 100.4,
            "upload_speed": 45.8,
            "ping": 15.0,
            "created_at": "2024-11-14T08:25:19.123456Z"
        }
    ]
}
```

- **Failure (400 Bad Request):**
    - Invalid `page`, `entries`, `sortby`, or `asc` parameters:
    ```json
    {
        "error": "Invalid page or entries parameter."
    }
    ```

---

##### **Action: `all`**

- **Description:** Returns all speed test records sorted by a specified field.

**Example Request:**  
`GET /api/speedtest-history/?action=all&sortby=ping&asc=true`

**Response:**
```json
{
    "total": 3,
    "results": [
        {
            "download_speed": 90.2,
            "upload_speed": 40.1,
            "ping": 5.5,
            "created_at": "2024-11-13T12:00:00.123456Z"
        },
        {
            "download_speed": 85.6,
            "upload_speed": 38.7,
            "ping": 6.0,
            "created_at": "2024-11-14T09:00:00.654321Z"
        },
        {
            "download_speed": 88.4,
            "upload_speed": 39.0,
            "ping": 7.2,
            "created_at": "2024-11-15T15:30:00.987654Z"
        }
    ]
}
```

- **Failure (400 Bad Request):**
    - Invalid `sortby` or `asc` parameters:
    ```json
    {
        "error": "Invalid sortby parameter."
    }
    ```

---

#### Summary of Actions for `/api/speedtest-history/`

| Action   | Description                                | Additional Parameters                    | Response                              |
|----------|--------------------------------------------|------------------------------------------|---------------------------------------|
| `brief`  | Aggregated statistics (max, min, avg).     | None                                     | JSON summary.                         |
| `partial`| Paginated results with sorting.            | `page`, `entries`, `sortby`, `asc`       | JSON paginated data.                  |
| `all`    | All results with sorting.                  | `sortby`, `asc`                          | JSON list of all records.             |

---

### **Error Handling Notes:**
- Invalid or missing `action` returns:
    ```json
    {
        "error": "Invalid action parameter."
    }
    ```
- Parameters like `page`, `entries`, `sortby`, and `asc` are validated, returning errors if they are invalid. 

---

## 3. Website Monitor

### **3.1. Run Website Monitor**
- **Endpoint:** `/api/web-monitor/run/`
- **Method:** `GET`
- **Description:** Run website monitoring for a single URL (via query parameter) or all URLs in the database.

#### **Request**
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `url`     | string | No       | URL to monitor (optional).           |

#### **Response**
- **Success:**
```json
{
  "message": "Website monitor completed."
}
```
- **Failure:**
```json
{
  "error": "Something went wrong."
}
```

---

### **3.2. Add or Delete a Website**
- **Endpoint:** `/api/web-monitor/add/`
- **Method:** `POST`, `DELETE`
- **Description:** Add or delete a website from the database.

#### **POST Request**
| Parameter              | Type    | Required | Description                        |
|------------------------|---------|----------|------------------------------------|
| `url`                  | string  | Yes      | Website URL.                       |
| `tag`                  | string  | No       | Website tag.                       |
| `monitor_all_events`   | boolean | No       | Monitor all events.                |
| `monitor_down_events`  | boolean | No       | Monitor only down events.          |
| `dest_ip`              | string  | No       | Destination IP address.            |

#### **POST Response**
- **Success:**
```json
{
  "message": "Website added successfully with URL: <url>."
}
```
- **Failure:**
```json
{
  "error": "Error details"
}
```

---

#### **DELETE Request**
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `url`     | string | Yes      | Website URL to delete.|

#### **DELETE Response**
- **Success:**
```json
{
  "message": "Website deleted successfully with URL: <url>."
}
```
- **Failure:**
```json
{
  "error": "Error details"
}
```

---

### **3.3. Website Monitor Results**
- **Endpoint:** `/api/web-monitor/`
- **Method:** `GET`
- **Description:** Retrieve website monitor results from the database.

#### **Request Parameters**
| Parameter   | Type    | Required | Description                                                 |
|-------------|---------|----------|-------------------------------------------------------------|
| `action`    | string  | Yes      | Determines the type of results (`brief`, `detail`, `list-partial`, `list-all`). |
| `url`       | string  | No       | Specific website URL (required for `detail` and `list-partial`).|
| `limit`     | integer | No       | Limit the number of results (`brief`).                   |
| `page`      | integer | No       | Page number for pagination (`list-partial`).                |
| `entries`   | integer | No       | Number of results per page (`list-partial`).                |
| `asc`       | boolean | No       | Sort order: `true` for ascending, `false` for descending.  |

#### **Response Examples**

1. **Action: `brief`**
```json
[
  {
    "website": {
      "url": "https://example.com",
      "tag": "Example"
    },
    "results": [200, 200, 503, 200]
  },
  ...
]
```

2. **Action: `detail`**
```json
{
  "id": 1,
  "url": "https://example.com",
  "tag": "Example",
  "dest_ip": "123.456.789.0",
  "monitor_all_events": true,
  "monitor_down_events": false
}
```

3. **Action: `list-partial`**
```json
{
  "from": 1,
  "to": 5,
  "total": 9,
  "results": [
    {
      "website": "wayback-api.archive.org",
      "status_code": 200,
      "latency": 1.282838,
      "created_at": "2024-12-18T22:26:27.924157"
    },
    ...
    ]
}
```

4. **Action: `list-all`**
```json
{
  "total": 9,
  "results": [
    {
      "website": "wayback-api.archive.org",
      "status_code": 200,
      "latency": 1.282838,
      "created_at": "2024-12-18T22:26:27.924157"
    },
    ...
    ]
}
```

5. **Invalid Action**
```json
{
  "error": "Invalid action."
}
```

---