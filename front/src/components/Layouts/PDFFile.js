import React, { useEffect, useState } from 'react';
import { Page, Text, Document, StyleSheet, Image, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
  },
  strong: {
    fontWeight: 'bold',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
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

  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>Ticket Information</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Technicien:</Text> {ticketData.nom_technicien}
          {"\n"}
          <Text style={styles.strong}>Urgence:</Text> {ticketData.urgence}
          {"\n"}
          <Text style={styles.strong}>Priorité:</Text> {ticketData.priorite}
          {"\n"}
          <Text style={styles.strong}>Statut:</Text> {ticketData.statut_actuel}
          {"\n"}
          <Text style={styles.strong}>Type de matériel:</Text> {ticketData.type_materiel}
        </Text>
        
        {imageBlob && <Image src={URL.createObjectURL(imageBlob)} />}
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
};

export default PDFFile;
