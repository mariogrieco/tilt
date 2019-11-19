import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15,
  },
  containerJoin: {
    flexDirection: 'row',
    marginTop: '1rem',
    marginLeft: 15,
  },
  header: {
    color: '#0E141E',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16.5,
    letterSpacing: 0.1,
  },
  span: {
    color: '#585C63',
    fontSize: 15,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
  },
  hashtag: {
    // color: '#8E8E95'
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 2,
  },
  headerContainer: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  paddingBottom: {
    paddingBottom: '0.25rem',
  },
  imageContainer: {
    height: '3rem',
    width: '3rem',
    alignItems: 'center',
    paddingTop: '0.65rem',
    paddingBottom: '0.25rem',
  },
  join: {
    marginTop: 6,
    width: 80,
    height: 34,
    borderRadius: 17,
    // backgroundColor: 'rgba(16, 115, 240, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinText: {
    color: '#17C491',
    fontSize: 16,
    letterSpacing: 0.2,
    fontFamily: 'SFProDisplay-Bold',
  },
  unreadText: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  unreadMessages: {
    marginLeft: 5,
    borderRadius: 11,
    paddingHorizontal: 8,
    backgroundColor: '#17C491',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
