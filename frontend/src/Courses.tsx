import {useEffect, useState} from "react";

interface Course {
    id: number,
    name: string
}

export const Courses = (props: {}) => {

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8080/courses'); // Podmie? na URL swojego backendu
                if (!response.ok) {
                    throw new Error('B??d przy pobieraniu danych');
                }
                const data = await response.json();
                setCourses(data); // Ustawienie pobranych danych w stanie
                setLoading(false); // Zako?czenie ?adowania
            } catch (error: any) {
                setError(error.message); // Obs?uga b??dów
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if (loading) {
        return <div>?adowanie...</div>;
    }

    if (error) {
        return <div>B??d: {error}</div>;
    }

    return (
        <div>
            <h1>Kursy</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.name}</li>
                ))}
            </ul>
        </div>
    );
};
