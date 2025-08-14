export const userLogged =  {
    "User_Id": 1,
    "Email": "coreo@gmail.com",
    "Password": "Hola123",
    "Nombre": "Andres",
    "Apellido": 'Tobar',
    "Fecha_Nacimiento": "1998-05-15",
    "EsActivo": 1,
    "created_at": "2024-10-19T14:30:00Z",
    "Pais_Residencia": 170,
    "Telefono": '3009843760',
    "Profile_Picture": '/img/InkValuationLogo.png',
    "UserSuscription": { // esto es un innerJoin
        "Suscription_Id": 1,
        "User_Id": 1,
        "Start_Date": "2023-11-15",
        "End_Date": "2024-11-15",
        "Plan_Id": 1,
        "Status": 1,
        "Automatic_Renovation": 1,
        "SuscriptionPlan": { // esto es un innerJoin
            "Plan_Id": 1,
            "Plan_Name": "Plan Inicial",
            "Price": 0,
            "Attentions_Limit": 10,
            "Duration": 1,
            "created_at": "2023-10-19T14:30:00Z"
        },
        
    }
}
