# nodejs-procurement-management

## `Routes`

  - **AUTH**
    - *To login*
      - [POST]  `/auth/login`
        ```json
          {
            "email": "admin@mailinator.com",
            "phone": "9876543210",
            "password": "user123456",
            "type": "admin"  // user, inspection, procurement, admin
          }
        ```

  - **USER**
    - *Get users*
      - [GET] `/users`
    - *Create users*
      - [POST] `/users`
        ```json
          {
            "name": "user-1",
            "email": "user-1@gmail.com",
            "password": "user123456",
            "role": "user",
            "phone": "9876543210"
          }
        ```
    - *Inspection Assign to Procurement-manager*
      - [POST] `/users/inspection/assign`
        ```json
          {
            "inspectionUserId": "62d7dcf2eec1b691df772881",
            "procurementUserId": "62d7e4082514caaf87535e21"
          }
        ```

  - **ORDER**
    - *Get Orders*
      - [GET] `/order`
    - *Create Orders*
      - [POST] `/order`
        ```json
          {
            "title": "First Order",
            "userId": "62d7df04b983de200bef70a9",
            "price": 5000
          }
        ```
    - *Update Orders status*
      - [PATCH] `/order/:orderId`
        ```json
          {
            "status": "assigned" // 'pending', 'assigned', 'toConfirm', 'completed'
          }
        ```

  - **Checklist**
    - *Get Checklist*
      - [GET] `/checklist`
    - *Create Checklist*
      - [POST] `/checklist`
        ```json
          {
            "name": "First check list",
            "orderId": "62d9a441b417d34553668007",
            "fields": [
              {
                "type": "radio",
                "name": "Cooler Present",
                "options": [
                  "yes",
                  "no"
                ],
                "isRequired": true
              },
              {
                "type": "dropdown",
                "name": "Category",
                "options": [
                  "Eatable",
                  "Drinkable",
                  "Medicine"
                ],
                "isRequired": true
              },
              {
                "type": "checkbox",
                "name": "Driver Details",
                "options": [
                  "License Present",
                  "Driver Number Active",
                  "Vehical RC Book Present"
                ],
                "isRequired": true
              },
              {
                "type": "textbox",
                "name": "Note",
                "options": "",
                "isRequired": false
              }
            ]
          }
        ```
    - *Fill/update Checklist*
      - [PATCH] `/checklist/:checklistId`
        ```json
          [
            {
              "fieldId": "62d9a58a6c5541ecb8b07fc5",
              "value": "yes"
            },
            {
              "fieldId": "62d9a58a6c5541ecb8b07fc6",
              "value": "Drinkable"
            },
            {
              "fieldId": "62d9a58a6c5541ecb8b07fc7",
              "value": [
                "License Present",
                "Driver Number Active"
              ]
            },
            {
              "fieldId": "62d9a58a6c5541ecb8b07fc8",
              "value": "Notes..."
            }
          ]
        ```
