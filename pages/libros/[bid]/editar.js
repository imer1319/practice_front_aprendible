import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/router";

export async function getServerSideProps({ params }){
	const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${params.bid}`)
	const data = await res.json()

	return {
		props: {
			book: data
		}
	}
}

const BookEdit = ({ book }) => {
	const router = useRouter()
	const [bookTitle, setBookTitle] = useState(book.title)
	const [errors, setErrors] = useState([])
	const [submitting, setSubmitting] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		setSubmitting(true)
		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${book.id}`,{
			method: 'POST',
			headers:{
				accept:'application/json',
				'content-type':'application/json'
			},
			body: JSON.stringify({
				title: bookTitle,
				_method: 'PATCH'
			})
		})

		if(res.ok) {
			setErrors([])
			setBookTitle('')
			return router.push('/libros')
		}
		const data = await res.json()
		setErrors(data.errors)
		setSubmitting(false)
	}

	return (
		<div>
			<h1>Editar</h1>

			<form onSubmit={handleSubmit}>
				<input
				value={String(bookTitle)}
				onChange={(e) => setBookTitle(e.target.value)}
				type="text"
				disabled={submitting}
				data-cy="input-book-title"
				/>
				<button 
				data-cy="button-submit-book"
				disabled={submitting}>{submitting ? 'Enviando': 'Enviar'}</button>
				{errors.title && (
					<span style={{
						color:'red', display: 'block'
					}}>
					{errors.title}
					</span>
				)}
			</form>

			<Link href="/libros">Lista libros</Link>
		</div>
		)
	}

	export default BookEdit