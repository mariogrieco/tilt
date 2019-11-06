# Theme construction


inside the themes.js at the reducers folder in where the themes variables are set.

```
const initialState = {
  dark: {
    colorPrimary: '#FFFF',
    colorLight: '#585c63',
    green: '#17C491',
    red: '#FC3E30',
    backgroundPrimary: '#040D14',
    buttonTextColor: '#040d14',
    borderBottomColor: '#353942',
    headerTintColor: '#FFF',
  },
  light: {
    colorPrimary: '#0e141e',
    colorLight: '#585c63',
    green: '#17C491',
    red: '#FC3E30',
    backgroundPrimary: '#FFFF',
    buttonTextColor: '#FFF',
    borderBottomColor: '#DCDCDC',
    headerTintColor: '#0E141E',
  },
  current: 'light',
};
```

dark and light are themes, current is for notify the app which is the current theme in runtime, or the default if async storage is empty (future feature where migration is done)

steps for integrate the theme to a component

first, we need made sure that the component is connected to redux, example:

```
export default connect(mapStateToProps)(Component);
```

second, once we are sync we need get the current theme in redux

```
const mapStateToProps = ({themes}) => ({theme: themes[themes.current]})
```

and we are ready for start style our component.

usage examples

```
render() {
    const {theme} = this.props;
    return (
        <Text style={[ styles.myCustomBaseStyle, {color: theme.colorPrimary}]}>
            I can change my color dynamically !
        </Text>
    );
}
```

```
render() {
    const {theme} = this.props;
    return (
        <View style={{backgroundColor: themes.backgroundPrimary}}>
        </View>
    );
}
```

the theme can sync properties that not are direct styles
```
render() {
    const {theme} = this.props;
    return (
        <TextInput
            placeholder="Username or Email"
            name="username"
            onChangeText={username => {
            this.setState({username});
            }}
            style={[styles.placeholders, {color: theme.colorPrimary}]}
            autoCapitalize="none"
            placeholderTextColor={theme.colorLight}
        />
    );
}
```
placeholderTextColor is a prop that changes the placeholder color for the input and it can change with the theme out of the styles!

look at theme the theme variable can access to all the properties assigned in the previous theme structure colorPrimary, colorLight, etc.


