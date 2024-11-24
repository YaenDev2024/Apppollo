import { useNavigation } from '@react-navigation/native'
import { View } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native-svg'
import Icons from '../../components/Icons'

const BuyScreenDetail = () => {
  const navigation = useNavigation()
  return (
    <View>
         <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Iconsons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <Text>Detalles de la compra:</Text>
      </View>
    </View>
  )
}

export default BuyScreenDetail