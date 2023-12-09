import React, { useEffect, useState } from 'react';
import { Page, Text, Document, StyleSheet, Image, View } from '@react-pdf/renderer';
import logoCopef from '../../assets/logo/copefrito.png';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    position: 'relative',
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50, // ajuster la taille du logo selon vos besoins
    height: 50, // ajuster la taille du logo selon vos besoins
    borderRadius: 20, // pour rendre le logo rond
  },
  coupon: {
    border: '2pt solid #3498db',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    boxShadow: '5px 5px 5px #888888',
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  text: {
    marginVertical: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  strong: {
    fontWeight: 'bold',
  },
  image: {
    marginTop: 20,
    marginBottom: 20,
    maxWidth: '100%',
    height: 200,
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10, // ajuster la marge pour abaisser le tableau
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellKey: {
    borderBottomColor: '#bdc3c7',
    borderBottomWidth: 1,
    textAlign: 'left',
    padding: 8,
    backgroundColor: '#ecf0f1',
    fontWeight: 'bold',
    width: '40%',
  },
  tableCellValue: {
    borderBottomColor: '#bdc3c7',
    borderBottomWidth: 1,
    textAlign: 'left',
    padding: 8,
    width: '60%',
  },
  interventionCell: {
    borderBottomColor: '#bdc3c7',
    borderBottomWidth: 1,
    textAlign: 'left',
    padding: 10,
    width: '100%',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const PDFFile = ({ ticketData }) => {
  const [imageBlob, setImageBlob] = useState(null);

  useEffect(() => {
    const fetchImageBlob = async () => {
      try {
        const response = await fetch(`http://localhost:8000/uploads/materiels/${ticketData.image_materiel_url}`);
        const blob = await response.blob();
        setImageBlob(blob);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image en blob :', error);
      }
    };

    fetchImageBlob();
  }, [ticketData.image_materiel_url]);

  const importantTicketData = {
    'ID Ticket': ticketData.id_ticket,
    'Date Création': ticketData.date_creation,
    'Urgence': ticketData.urgence,
    'Priorité': ticketData.priorite,
    'Statut Actuel': ticketData.statut_actuel,
    'Date Résolution': ticketData.date_resolution,
    'Intervention Faite': ticketData.intervention_faite,
    'Suite à Donner': ticketData.suite_a_donnee,
    'Créé le': ticketData.created_at,
    'Mis à jour le': ticketData.updated_at,
    'Type de Matériel': ticketData.type_materiel,
    'Nom du Demandeur': ticketData.username,
    'Nom de l\'Entreprise': ticketData.nom_entreprise,
    'Nom du Technicien': ticketData.nom_technicien,
  };

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logoCopef} />
        </View>
        <View style={styles.coupon}>
          <Text style={styles.title}>Ticket Information</Text>
          <View style={styles.table}>
            {Object.entries(importantTicketData).map(([key, value]) => (
              <View style={styles.tableRow} key={key}>
                <Text style={styles.tableCellKey}>{key}</Text>
                <Text style={styles.tableCellValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
};

export default PDFFile;
