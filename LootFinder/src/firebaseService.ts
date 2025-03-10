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

interface BountyItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  buyerId: string | DocumentReference;
}

// Function to fetch a bounty and resolve buyerId reference
export async function fetchItemWithBuyer(
  itemId: string
): Promise<BountyItem | null> {
  try {
    const docRef = doc(db, 'bounty', itemId); // Fetch from bounty collection
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('No such bounty item!');
      return null;
    }

    let bountyData = docSnap.data() as BountyItem;

    // Convert buyerId reference to actual ID if needed
    if (bountyData.buyerId instanceof Object && 'path' in bountyData.buyerId) {
      const buyerSnap = await getDoc(bountyData.buyerId as DocumentReference);
      bountyData.buyerId = buyerSnap.id;
    }

    return bountyData;
  } catch (error) {
    console.error('Error fetching bounty item:', error);
    return null;
  }
}
