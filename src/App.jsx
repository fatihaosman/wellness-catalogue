
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://r1qhdf5vr8.execute-api.af-south-1.amazonaws.com'

function App() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryArea: '',
    product: '',
    quantity: 1,
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Get products from AWS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        setProductsError('')

        const response = await fetch(`${API_URL}/products`)

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data = await response.json()

        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
        setProductsError('Unable to load products. Please try again.')
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // Select a product and move to inquiry form
  const handleInterest = (productId) => {
    setSelectedProduct(productId)

    setFormData((previousData) => ({
      ...previousData,
      product: productId,
    }))

    document.getElementById('inquiry').scrollIntoView({
      behavior: 'smooth',
    })
  }

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    if (name === 'product') {
      setSelectedProduct(value)
    }
  }

  // Submit inquiry to AWS
  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit inquiry')
      }

      setSuccessMessage(
        'Your inquiry has been submitted successfully. We will contact you soon.'
      )

      // Clear the form
      setFormData({
        name: '',
        phone: '',
        deliveryArea: '',
        product: '',
        quantity: 1,
        message: '',
      })

      setSelectedProduct('')
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      setErrorMessage(
        'Sorry, we could not submit your inquiry. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <header>
        <div className="brand">
          <h1>Female Care</h1>
          <p>Healthy Women • Brighter Tomorrows</p>
        </div>

        <nav>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#inquiry">Inquire</a>
        </nav>
      </header>

      {/* Introduction */}
      <section className="hero">
        <h2>Feel confident in your feminine wellness</h2>

        <p>
          Explore our selection of women's wellness products and
          send an inquiry for the product you are interested in.
        </p>

        <a href="#products" className="hero-button">
          Explore Products
        </a>
      </section>

      {/* Products */}
      <section id="products">
        <h2>Our Products</h2>

        <p className="section-intro">
          Explore our feminine care and wellness products.
        </p>

        {loadingProducts && (
          <p className="section-intro">Loading products...</p>
        )}

        {productsError && (
          <p className="section-intro">{productsError}</p>
        )}

        {!loadingProducts && !productsError && (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.productId}>
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={`${product.name} women's wellness product`}
                  />
                </div>

                <div className="product-content">
                  <h3>{product.name}</h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <h4>Benefits</h4>

                  <ul>
                    {product.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit.trim()}</li>
                    ))}
                  </ul>

                  <p className="price">
                    KSh {Number(product.price).toLocaleString()}
                  </p>

                  <button
                    className="interest-button"
                    onClick={() => handleInterest(product.productId)}
                  >
                    I'm Interested
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about">
        <h2>About Female Care</h2>

        <p>
          Female Care makes it easier to explore selected women's
          wellness products and ask about the products that interest you.
          Our focus is on making product information simple and accessible.
        </p>
      </section>

      {/* Inquiry */}
      <section id="inquiry">
        <h2>Send an Inquiry</h2>

        <p className="section-intro">
          Interested in a product? Fill in your details and send us an inquiry.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone / WhatsApp
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Delivery Area
            <input
              type="text"
              name="deliveryArea"
              value={formData.deliveryArea}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Product
            <select
              name="product"
              value={selectedProduct}
              onChange={handleChange}
              required
            >
              <option value="">Select a product</option>

              {products.map((product) => (
                <option
                  key={product.productId}
                  value={product.productId}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Anything you would like to ask?"
            ></textarea>
          </label>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default App
