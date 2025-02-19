import { db } from './firebase';
import { doc, getDoc, DocumentReference } from 'firebase/firestore';

// Define TypeScript interface for an item
interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  sellerId: string | DocumentReference;
}

// Function to fetch an item and resolve sellerId reference
export async function fetchItemWithSeller(
  itemId: string
): Promise<Item | null> {
  try {
    const docRef = doc(db, 'offer', itemId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('No such item!');
      return null;
    }

    let itemData = docSnap.data() as Item;

    // Convert sellerId reference to actual ID if needed
    if (itemData.sellerId instanceof Object && 'path' in itemData.sellerId) {
      const sellerSnap = await getDoc(itemData.sellerId as DocumentReference);
      itemData.sellerId = sellerSnap.id;
    }

    // console.log('Final Item Data:', itemData);
    return itemData;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}
