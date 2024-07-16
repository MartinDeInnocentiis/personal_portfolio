import './ContactScreen.css'

const ContactScreen = () => {
    return (
        <div className='contactscreen-container'>
        <h1 className='contact-h1'>Contact me</h1>
        <div className='contact-container'>
            <form className='contact-form' >
                <label htmlFor='name'>Name:</label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Enter name'
                    required
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='example@gmail.com'
                    required
                />
                <label htmlFor='subject'>Subject:</label>
                <input
                    type='text'
                    id='subject'
                    name='subject'
                    placeholder='SUBJECT'
                    required
                />
                <label htmlFor='message'>Message:</label>
                <textarea
                    id='message'
                    name='message'
                    placeholder='Enter your message...'
                    required
                    className='form-message'
                ></textarea>
                <button type='submit'>Send</button>
            </form>
        </div>
    </div>
    )
}

export default ContactScreen
 