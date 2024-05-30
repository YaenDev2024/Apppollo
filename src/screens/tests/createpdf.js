import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Print} from 'expo'


const Createpdf = ({ image }) => {
    const [filename, setfilename] = useState('')
    const currentYear = new Date().getDate();


  const createPDF = async () => {
    Alert.alert(image)
    try {
        const htmlContent = `
        <html>
          <body>
            <img src="${image}" style="max-width: 100%;" />
          </body>
        </html>
      `;

      
      let PDFOptions = {
        html: htmlContent,
        fileName: `ticket `  +currentYear,
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);
      if (!file.filePath) return;
      console.log(file.filePath);
    } catch (error) {
      console.log('Failed to generate pdf', error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={createPDF}>
        <Text style={{ color: 'black' }}>Create PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: '#E9EBED',
    borderColor: '#f4f5f6',
    borderWidth: 1,
  },
});

export default Createpdf;
