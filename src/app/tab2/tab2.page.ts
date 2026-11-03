import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButton, IonContent, IonHeader, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRefresher, IonRefresherContent, IonSearchbar, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/angular';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';

import { environment } from '../../environments/environment';

const app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const productsCol = collection(db, 'products');

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonButton,
    IonItemOptions,
    IonText,
  ],
})
export class Tab2Page {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  categories = ['All', 'Electronics', 'Clothing', 'Food', 'Home & Kitchen', 'Others'];
  isLoading = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'success';
  selectedProduct: any = null;
  isDetailsModalOpen = false;
  private unsubscribeProducts?: () => void;

  constructor(private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    this.subscribeToProducts();
  }

  ionViewWillLeave() {
    this.unsubscribeProducts?.();
  }

  subscribeToProducts() {
    this.unsubscribeProducts?.();
    this.unsubscribeProducts = onSnapshot(productsCol, (snapshot) => {
      this.products = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
      this.filterProducts();
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const name = String(product.productName ?? '').toLowerCase();
      const matchesSearch = name.includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  async doRefresh(event: any) {
    this.subscribeToProducts();
    setTimeout(() => event.target.complete(), 500);
  }

  async deleteProduct(productId: string) {
    this.isLoading = true;

    try {
      await deleteDoc(doc(db, 'products', productId));
      this.showToast('Product deleted!', 'success');
    } catch (error) {
      this.showToast('Error deleting product', 'danger');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  openProductDetails(product: any) {
    this.selectedProduct = product;
    this.isDetailsModalOpen = true;
  }

  closeProductDetails() {
    this.isDetailsModalOpen = false;
    this.selectedProduct = null;
  }

  async updateProduct(product: any) {
    const alert = await this.alertCtrl.create({
      header: 'Update Product',
      inputs: [
        {
          name: 'productName',
          type: 'text',
          value: product.productName ?? '',
          placeholder: 'Product Name',
        },
        {
          name: 'price',
          type: 'number',
          value: product.price ?? 0,
          placeholder: 'Price',
        },
        {
          name: 'category',
          type: 'text',
          value: product.category ?? '',
          placeholder: 'Category',
        },
        {
          name: 'quantity',
          type: 'number',
          value: product.quantity ?? 0,
          placeholder: 'Quantity',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: async (data) => {
            const productName = String(data?.productName ?? '').trim();
            const category = String(data?.category ?? '').trim();
            const price = Number(data?.price ?? 0);
            const quantity = Number(data?.quantity);

            if (!productName || !category || Number.isNaN(price) || Number.isNaN(quantity) || quantity < 0) {
              return false;
            }

            this.isLoading = true;
            try {
              const productRef = doc(db, 'products', product.id);
              await updateDoc(productRef, {
                productName,
                price,
                category,
                quantity,
              });
              this.showToast('Product updated!', 'success');
              return true;
            } catch (error) {
              this.showToast('Error updating product', 'danger');
              console.error(error);
              return false;
            } finally {
              this.isLoading = false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  showToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }
}