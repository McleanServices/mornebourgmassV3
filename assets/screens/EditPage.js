import * as React from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const EditPage = () => {
  const navigation = useNavigation();
  return (
    <Card.Title
      title="Card Title"
      subtitle="Card Subtitle"
      left={(props) => <Avatar.Icon {...props} icon="home" />}
      right={(props) => (
        <>
          <IconButton {...props} icon="more" onPress={() => navigation.navigate("EditHome") } />
        </>
      )}
    />
  );
};

export default EditPage;