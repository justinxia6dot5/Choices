import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Animated} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native";
import AsyncStorage from '@react-native-community/async-storage';

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)


foods = [
  {'Italian': ['Risotto', 'Tiramisu', 'Arancini', 'Gelato', 'Polenta', 'Ribollita', 'Lasagne', 'Prosciutto', 'Panini', 'Parmigiana', 'Minestrone', 'Fettuccine Alfredo', 'Margherita Pizza']},
  {'Chinese': ['Sweet and Sour Pork', 'Kung Pao Chicken', 'Ma Po Tofu', 'Wontons', 'Dumplings', 'Chow Mein', 'Peking Roasted Duck', 'Spring Rolls']},
  {'Mexican': ['Burrito', 'Carne Asada', 'Quesadilla', 'Chilaquiles', 'Taco', 'Birria', 'Tostada']},
  {'Japanese': ['Sushi', 'Tempura', 'Yakitori', 'Tsukemono pickles', 'Kaiseki', 'Udon', 'Soba', 'Sukiyaki', 'Sashimi', 'Miso soup']},
  {'Indian': ['Butter Chicken', 'Tandoori Chicken', 'Chicken Tikka Masala', 'Red Lamb', 'Malai Kofta', 'Chole', 'Palak Paneer', 'Kaali Daal', 'Papdi Chaat', 'Naan']},
  {'American': ['Apple Pie', 'Hamburger', 'Clam Chowder', 'Bagel and Lox', 'Deep-Dish Pizza', 'Drop Biscuits and Sausage Gravy', 'Texas Barbecue', 'Hominy Grits', 'Buffalo Chicken Wings']},
  {'Mediterranean': ['Feta', 'Lentils & Yogurt', 'Spanakopita', 'Baba Ganoush', 'Hummus', 'Mediterranean Cobb Salad', 'Paella', 'Fish', 'Ratatouille', 'Greek Gyros', 'Tuscan Chicken']},
  {'Thai': ['Tom Yum Goong', 'Som tum', 'Tom kha kai', 'Gaeng daeng', 'Pad Thai','Khao Pad', 'Pad krapow moo', 'Gaeng keow wan kai', 'Yum nua', 'Kai med ma muang']},
  {'Vietnamese': ['Pho', 'Banh Mi', 'Banh Xeo', 'Goi Cuon', 'Mi Quang', 'Bun Thit Nuong', 'Com Tam', 'Banh Cuon', 'Xoi Xeo', 'Ca Kho To']},
  {'French': ['Bouillabaisse', 'Quiche Lorraine', 'Steak-Frites', 'Coq au vin', 'Bœuf Bourguignon', 'Cassoulet', 'Escargots de Bourgogne', 'Moules mariníères', 'Choucroute Garnie', 'Sole Meunière']},
  {'Greek': ['Souvlaki', 'Moussaka', 'Meat balls', 'Dolmadakia', 'Taramasalata', 'Greek salad', 'Fasolada', 'Gemista', 'Spanakopita']},
];

class Cuisine extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onBubbleClick = this.onBubbleClick.bind(this);
  }

  onBubbleClick = item => {
    val = item.animated_value
    console.log(item);
    Animated.timing(val, {
       toValue: (val._value == 150 ? 0 : 150),
       duration: 500
    }).start();

     item.checked = !item.checked
  };

  render() {
    const interpolateBGColor = val => {
      return val.interpolate({
        inputRange: [0, 150],
        outputRange: ['rgb(255, 205, 145)', 'rgb(228,95,28)']
      })
    };

    const animatedStyle = val => {
      return {
        backgroundColor: interpolateBGColor(val),
      }
    };

    let foods_comp = []
    cu = foods[this.props.in][this.props.name]
    for(let i = 0; i < cu.length - 1; i++){
      foods_comp.push(
        <AnimatedButton key = {i.toString()} style = {[styles.bubble, animatedStyle(cu[i].animated_value)]} onPress = {() => this.onBubbleClick(foods[this.props.in][this.props.name][i])}><Text style = {styles.food_item}>{cu[i].dishName}</Text></AnimatedButton>
      )
    }
    const setCollapsed = (isCollapsed) => {
      cu[cu.length - 1] = isCollapsed;
    };
    return (

      <Collapse
  	        isCollapsed={cu[cu.length - 1]}
  	        onToggle={(isCollapsed)=> setCollapsed(isCollapsed)}>
              <CollapseHeader>
                <View style = {styles.header}><Text>{this.props.name}</Text></View>
              </CollapseHeader>
              <CollapseBody>
              {foods_comp}
              </CollapseBody>
      </Collapse>
    )
  }
}

export default class Preferences extends Component{
  constructor(props) {
    super(props);
    foods.forEach( cuisine => {
      for(var k in cuisine) {
        cuisine[k] = cuisine[k].map((dish, index) => {
          return {
            id: index.toString(),
            dishName: dish,
            checked: false,
            animated_value: new Animated.Value(0),
          }
        })
        cuisine[k].push(false)
        break;
      }
    })

    this.savePrefrences = this.savePrefrences.bind(this);

    this.state = {};
  }

  savePrefrences = async () => {
    console.log('save pref');
    // store in AsyncStorage

    data = []
    foods.forEach(item => {
      itemArr = item[Object.keys(item)[0]]
      itemArr.forEach(food => {
        if(food != false && food.dishName !== undefined) {
          data.push([food.dishName, food.checked])
        }
      })
    })

    console.log(data);


    try {
      await AsyncStorage.setItem('@prefrences', JSON.stringify(data))
    } catch (e) {
      // saving error
      console.log(e);
    }

    // navigate to scan page
    this.props.navigation.navigate('Scan');
  }

  render() {
    // <Cuisine cuisineIndex = index />
    return (
      <View style = {styles.container}>
      <Text style={styles.title}>
            Preferences
      </Text>
      <FlatList
        data = {foods}
        contentContainerStyle={{flexGrow: 0.5, justifyContent: 'space-evenly'}}
        renderItem = {({ item, index }) => <Cuisine in = {index} name = {Object.keys(item)[0]}/>}
        keyExtractor={(item,index) => index.toString()}
      />
      <TouchableOpacity
          style={styles.customBtnBG}
          onPress={this.savePrefrences}  >
          <Text style={styles.customBtnText}>Submit</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  customBtnText: {
    fontSize: 30,
    color: '#00b5ec',
    fontWeight: 'bold',
    alignItems:'center',
    justifyContent: 'center',
  },
  customBtnBG: {
    backgroundColor: '#e45f1c',
    paddingHorizontal: 15,
    paddingVertical: 2,
    
    borderRadius: 30,
    marginBottom: 40,
    alignItems:'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b5ec',
  },
  title: {
      marginTop: 70,
      color: '#e45f1c',
      fontWeight: 'bold',
      fontSize: 30,
      width:250,
      height:40,
      textAlign: 'center',
      alignItems:'center',
      justifyContent: 'center',
      marginBottom: 30,
  },
  header: {
      marginBottom: 20,
      backgroundColor: '#FFFFFF',
      borderRadius:15,
      width:250,
      height:30,
      alignItems:'center',
      alignSelf: 'flex-start',
      justifyContent: 'center',
  },
  bubble: {
      backgroundColor: '#e45f1c',
      borderRadius:30,
      overflow: 'scroll',
      marginTop: 5,
      marginLeft: 30,
      marginBottom: 5,

      alignItems:'flex-start',
      justifyContent: 'center',
  },
  food_item: {
    color: '#FFFFFF',
    fontWeight: '600',
    justifyContent: 'center',
    marginLeft: 15
  }
})
