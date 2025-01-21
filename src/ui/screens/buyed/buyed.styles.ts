import { StyleSheet } from 'react-native';

export const buyedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  itemContainer: {
    marginVertical: 8,
  },
  cardContainer: {
    width: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: 'blue',
  },
  separator: {
    height: 1,
    backgroundColor: '#645CBB',
    opacity: 0.2,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#645CBB',
    paddingTop: 16,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: 'black',
  },
  spacer: {
    height: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff4444',
    justifyContent: 'center',
  },

  clearText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff4444',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'green',
    justifyContent: 'center',
  },

  refreshText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'green',
  },
});
