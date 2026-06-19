const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Cargar credenciales de Firebase desde archivo (descargado de Firebase Console)
const serviceAccountPath = path.join(__dirname, "service-account-key.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    "❌ Archivo 'service-account-key.json' no encontrado.",
    "\nPasos:"
  );
  console.error(
    "1. Ve a Firebase Console > Configuración del Proyecto > Cuentas de Servicio"
  );
  console.error("2. Haz clic en 'Generar nueva clave privada'");
  console.error("3. Descarga el archivo JSON en la carpeta del proyecto");
  console.error("4. Renómbralo a 'service-account-key.json'");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Definición de competencias (extraídas del calendario)
const competitions = [
  {
    name: "Bronx 04",
    city: "Heredia",
    imageUrl: "https://via.placeholder.com/400?text=Bronx+04",
    color: "#ef4444",
  },
  {
    name: "Perros de Traba",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Perros+de+Traba",
    color: "#f97316",
  },
  {
    name: "Central Battles",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Central+Battles",
    color: "#fcd34d",
  },
  {
    name: "Leyendas 420",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Leyendas+420",
    color: "#22c55e",
  },
  {
    name: "Ritmoverso",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Ritmoverso",
    color: "#1e40af",
  },
  {
    name: "Código Øccidente",
    city: "Sarchi",
    imageUrl: "https://via.placeholder.com/400?text=Codigo+Occidente",
    color: "#a855f7",
  },
  {
    name: "Gallos de pelea",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Gallos+de+pelea",
    color: "#14b8a6",
  },
  {
    name: "Pacífico Flow Battles",
    city: "Pacífico",
    imageUrl: "https://via.placeholder.com/400?text=Pacifico+Flow",
    color: "#f97316",
  },
  {
    name: "Elander",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Elander+1v1",
    color: "#06b6d4",
  },
  {
    name: "Hunter Battles",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=Hunter+Battles",
    color: "#ec4899",
  },
  {
    name: "03 Under",
    city: "Cartago",
    imageUrl: "https://via.placeholder.com/400?text=03+Under",
    color: "#84cc16",
  },
  {
    name: "Reyes de Desampa",
    city: "Desamparados",
    imageUrl: "https://via.placeholder.com/400?text=Reyes+de+Desampa",
    color: "#1e40af",
  },
  {
    name: "ZHH",
    city: "San José",
    imageUrl: "https://via.placeholder.com/400?text=ZHH",
    color: "#ef4444",
  },
  {
    name: "Brumas Battles",
    city: "Cartago",
    imageUrl: "https://via.placeholder.com/400?text=Brumas+Battles",
    color: "#14b8a6",
  },
];

// Definición de eventos (extraídos del calendario)
const events = [
  // Junio 2026
  {
    name: "Bronx 04",
    date: new Date(2026, 5, 19, 18, 0), // 19 Junio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
  {
    name: "Perros de Traba Fecha 6",
    date: new Date(2026, 5, 20, 18, 0), // 20 Junio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Batalla de Freestyle Perros de Traba - Fecha 6",
  },
  {
    name: "Central Fecha 11",
    date: new Date(2026, 5, 27, 18, 0), // 27 Junio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Central Battles",
    description: "Batalla Central - Fecha 11",
  },
  {
    name: "Leyendas 420 F2",
    date: new Date(2026, 5, 28, 18, 0), // 28 Junio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Leyendas 420",
    description: "Leyendas 420 - Fecha 2",
  },

  // Julio 2026
  {
    name: "Ritmoverso - Batalla de Canciones",
    date: new Date(2026, 6, 4, 18, 0), // 4 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Ritmoverso",
    description: "Ritmoverso - Batalla de Canciones",
  },
  {
    name: "Código Øccidente Fecha 1",
    date: new Date(2026, 6, 4, 18, 0), // 4 Julio
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente - Fecha 1",
  },
  {
    name: "Gallos de pelea Vol.2 Fecha 2",
    date: new Date(2026, 6, 5, 18, 0), // 5 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.2 - Fecha 2",
  },
  {
    name: "Pacífico Flow Battles",
    date: new Date(2026, 6, 11, 18, 0), // 11 Julio
    city: "Pacífico",
    place: "Lugar por confirmar",
    competitionName: "Pacífico Flow Battles",
    description: "Pacífico Flow Battles en colaboración con ZHH",
  },
  {
    name: "Elander 1v1",
    date: new Date(2026, 6, 11, 18, 0), // 11 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Elander",
    description: "Elander",
  },
  {
    name: "Hunter Battles",
    date: new Date(2026, 6, 12, 18, 0), // 12 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Hunter Battles",
    description: "Hunter Battles",
  },
  {
    name: "Bronx 04",
    date: new Date(2026, 6, 17, 18, 0), // 17 Julio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
  {
    name: "Perros de Traba Fecha 7",
    date: new Date(2026, 6, 18, 18, 0), // 18 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Batalla de Freestyle Perros de Traba - Fecha 7",
  },
  {
    name: "Central Fecha Final",
    date: new Date(2026, 6, 19, 18, 0), // 19 Julio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Central Battles",
    description: "Central - Fecha Final",
  },
  {
    name: "Bronx 04 - Promesa del Under",
    date: new Date(2026, 6, 25, 18, 0), // 25 Julio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Bronx 04 - Promesa del Under",
  },
  {
    name: "03 Under X Hunter Battles Fecha 10",
    date: new Date(2026, 6, 25, 18, 0), // 25 Julio
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "03 Under",
    description: "03 Under X Hunter Battles - Fecha 10",
  },
  {
    name: "Reyes de Desampa Fecha 2 Duplas",
    date: new Date(2026, 6, 26, 18, 0), // 26 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Reyes de Desampa",
    description: "Reyes de Desampa - Fecha 2 (Duplas)",
  },
  {
    name: "Leyendas 420",
    date: new Date(2026, 6, 31, 18, 0), // 31 Julio
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Leyendas 420",
    description: "Leyendas 420",
  },

  // Agosto 2026
  {
    name: "Hunter Battles Cupo Limón",
    date: new Date(2026, 7, 2, 18, 0), // 2 Agosto
    city: "Limón",
    place: "Lugar por confirmar",
    competitionName: "Hunter Battles",
    description: "Hunter Battles - Cupo Limón",
  },
  {
    name: "Gallos de pelea Vol.3 Fecha 3",
    date: new Date(2026, 7, 2, 18, 0), // 2 Agosto
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.3 - Fecha 3",
  },
  {
    name: "Bronx Fecha Especial",
    date: new Date(2026, 7, 8, 18, 0), // 8 Agosto
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Bronx - Fecha Especial",
  },
  {
    name: "Final Nacional Central Battles",
    date: new Date(2026, 7, 9, 18, 0), // 9 Agosto
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Central Battles",
    description: "Final Nacional Central Battles",
  },
  {
    name: "Código Øccidente Fecha 2",
    date: new Date(2026, 7, 16, 18, 0), // 16 Agosto
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente - Fecha 2",
  },
  {
    name: "Perros de Traba Fecha 8 de Aniversario",
    date: new Date(2026, 7, 22, 18, 0), // 22 Agosto
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Perros de Traba - Fecha 8 de Aniversario",
  },
  {
    name: "Final Nacional Empire Battles",
    date: new Date(2026, 7, 23, 18, 0), // 23 Agosto
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Empire Battles",
    description: "Final Nacional Empire Battles",
  },
  {
    name: "Bronx 04 (San José)",
    date: new Date(2026, 7, 29, 18, 0), // 29 Agosto
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Bronx 04 - San José",
  },
  {
    name: "03 Under X Reyes de Desampa X Epic Centro Fecha 11",
    date: new Date(2026, 7, 30, 18, 0), // 30 Agosto
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "03 Under",
    description: "03 Under X Reyes de Desampa X Epic Centro - Fecha 11",
  },

  // Setiembre 2026
  {
    name: "ZHH vs Bronx 04",
    date: new Date(2026, 8, 5, 18, 0), // 5 Setiembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "ZHH",
    description: "ZHH vs Bronx 04",
  },
  {
    name: "03 Under Fecha 12",
    date: new Date(2026, 8, 12, 18, 0), // 12 Setiembre
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "03 Under",
    description: "03 Under - Fecha 12",
  },
  {
    name: "Gallos de pelea Vol.4 Fecha 4",
    date: new Date(2026, 8, 13, 18, 0), // 13 Setiembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.4 - Fecha 4",
  },
  {
    name: "Perros de Traba Fecha 9",
    date: new Date(2026, 8, 19, 18, 0), // 19 Setiembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Perros de Traba - Fecha 9",
  },
  {
    name: "Código Øccidente",
    date: new Date(2026, 8, 20, 18, 0), // 20 Setiembre
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente",
  },
  {
    name: "Reyes de Desampa Fecha 3",
    date: new Date(2026, 8, 26, 18, 0), // 26 Setiembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Reyes de Desampa",
    description: "Reyes de Desampa - Fecha 3",
  },
  {
    name: "Final Internacional Hunter Battles",
    date: new Date(2026, 8, 27, 18, 0), // 27 Setiembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Hunter Battles",
    description: "Final Internacional Hunter Battles",
  },

  // Octubre 2026
  {
    name: "Bronx 04",
    date: new Date(2026, 9, 16, 18, 0), // 16 Octubre
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
  {
    name: "Perros de Traba Fecha 10",
    date: new Date(2026, 9, 17, 18, 0), // 17 Octubre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Perros de Traba - Fecha 10",
  },
  {
    name: "Código Øccidente",
    date: new Date(2026, 9, 18, 18, 0), // 18 Octubre
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente",
  },
  {
    name: "Reyes de Desampa Fecha 4",
    date: new Date(2026, 9, 24, 18, 0), // 24 Octubre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Reyes de Desampa",
    description: "Reyes de Desampa - Fecha 4",
  },
  {
    name: "Bronx 04",
    date: new Date(2026, 9, 24, 18, 0), // 24 Octubre
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
  {
    name: "Gallos de pelea Vol.5 Fecha 5",
    date: new Date(2026, 9, 25, 18, 0), // 25 Octubre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.5 - Fecha 5",
  },

  // Noviembre 2026
  {
    name: "Bronx 04",
    date: new Date(2026, 10, 7, 18, 0), // 7 Noviembre
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
  {
    name: "Perros de Traba Fecha 11",
    date: new Date(2026, 10, 14, 18, 0), // 14 Noviembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Perros de Traba - Fecha 11",
  },
  {
    name: "Código Øccidente Fecha 5",
    date: new Date(2026, 10, 22, 18, 0), // 22 Noviembre
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente - Fecha 5",
  },
  {
    name: "Final Nacional Brumas Battles",
    date: new Date(2026, 10, 22, 18, 0), // 22 Noviembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Brumas Battles",
    description: "Final Nacional Brumas Battles",
  },
  {
    name: "Reyes de Desampa Fecha 5 Final Nacional",
    date: new Date(2026, 10, 26, 18, 0), // 26 Noviembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Reyes de Desampa",
    description: "Reyes de Desampa - Fecha 5 (Final Nacional)",
  },

  // Diciembre 2026
  {
    name: "Perros de Traba Final Nacional 2026",
    date: new Date(2026, 11, 5, 18, 0), // 5 Diciembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Perros de Traba",
    description: "Perros de Traba - Final Nacional 2026",
  },
  {
    name: "Gallos de pelea Vol.6 Fecha 6",
    date: new Date(2026, 11, 6, 18, 0), // 6 Diciembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.6 - Fecha 6",
  },
  {
    name: "Código Øccidente Final Nacional",
    date: new Date(2026, 11, 6, 18, 0), // 6 Diciembre (aproximado)
    city: "Occidente",
    place: "Lugar por confirmar",
    competitionName: "Código Øccidente",
    description: "Código Øccidente - Final Nacional",
  },
  {
    name: "ZHH Internacional",
    date: new Date(2026, 11, 12, 18, 0), // 12 Diciembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "ZHH",
    description: "ZHH - Internacional",
  },
  {
    name: "Gallos de pelea Vol.7 Fecha 7",
    date: new Date(2026, 11, 19, 18, 0), // 19 Diciembre
    city: "Nacional",
    place: "Lugar por confirmar",
    competitionName: "Gallos de pelea",
    description: "Gallos de pelea Vol.7 - Fecha 7",
  },
  {
    name: "Bronx 04",
    date: new Date(2026, 11, 20, 18, 0), // 20 Diciembre
    city: "San José",
    place: "Lugar por confirmar",
    competitionName: "Bronx 04",
    description: "Batalla de Freestyle Bronx 04",
  },
];

async function uploadData() {
  try {
    console.log("📤 Iniciando carga de datos a Firestore...\n");

    // Crear competencias
    console.log("📌 Creando competencias...");
    const competitionRefs = {};

    for (const competition of competitions) {
      const docRef = await db.collection("competitions").add({
        name: competition.name,
        city: competition.city,
        imageUrl: competition.imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      competitionRefs[competition.name] = docRef.id;
      console.log(`   ✓ ${competition.name}`);
    }

    console.log(`\n✅ ${competitions.length} competencias creadas\n`);

    // Crear eventos
    console.log("📌 Creando eventos...");
    let eventCount = 0;

    for (const event of events) {
      const competitionId = competitionRefs[event.competitionName];
      const competitionData = competitions.find((competition) => competition.name === event.competitionName);

      if (!competitionId) {
        console.warn(
          `   ⚠️  No se encontró competencia para: ${event.competitionName}`
        );
        continue;
      }

      const normalizedDate = new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        event.date.getDate(),
        0,
        0,
        0,
        0
      );
      const normalizedCity =
        event.city === "Nacional" && competitionData?.city
          ? competitionData.city
          : event.city;
      const normalizedPlace =
        event.place && event.place.toLowerCase() !== "lugar por confirmar"
          ? event.place
          : "";

      await db.collection("events").add({
        name: event.name,
        date: admin.firestore.Timestamp.fromDate(normalizedDate),
        city: normalizedCity,
        place: normalizedPlace,
        description: event.description,
        competitionId: competitionId,
        competitionName: event.competitionName,
        type: event.competitionName,
        imageUrl: "",
        hasCustomTime: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      eventCount++;
      console.log(`   ✓ ${event.name} (${event.competitionName})`);
    }

    console.log(`\n✅ ${eventCount} eventos creados\n`);

    console.log("🎉 ¡Carga completada exitosamente!");
    console.log(
      "💡 Próximo paso: ve a http://localhost:5173 y verifica los datos en la app"
    );
  } catch (error) {
    console.error("❌ Error al cargar datos:", error);
    process.exit(1);
  } finally {
    await admin.app().delete();
    process.exit(0);
  }
}

uploadData();
